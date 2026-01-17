import { Pool } from 'pg';
import * as Sentry from '@sentry/nextjs';

// PostgreSQL connection pool for raw SQL queries
let pool: Pool | null = null;

const getPool = () => {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    pool = new Pool({
      connectionString: databaseUrl,
      max: 15, // maximum number of clients in the pool, when update need to change in supabase dashboard too
      idleTimeoutMillis: 30000, // close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection cannot be established
    });
  }
  return pool;
};

// Helper function to get total user count from auth.users (verified only)
export const getTotalUserCount = async (): Promise<number> => {
  const pool = getPool();
  
  try {
    const result = await pool.query('SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL');
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Error fetching user count:', error);
    Sentry.captureException(error, { tags: { function: 'getTotalUserCount' } });
    return 0;
  }
};

// Helper function to update daily stats
export const updateDailyStats = async (
  date: string,
  updates: {
    total_users?: number;
    pdf_downloads?: number;
    emails_sent?: number;
  }
) => {
  const pool = getPool();

  try {
    const result = await pool.query(
      `INSERT INTO public.daily_stats (date, total_users, pdf_downloads, emails_sent)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (date) DO UPDATE SET
         total_users = COALESCE($2, daily_stats.total_users),
         pdf_downloads = COALESCE($3, daily_stats.pdf_downloads),
         emails_sent = COALESCE($4, daily_stats.emails_sent),
         updated_at = NOW()
       RETURNING *`,
      [date, updates.total_users, updates.pdf_downloads, updates.emails_sent]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error updating daily stats:', error);
    Sentry.captureException(error, { tags: { function: 'updateDailyStats' }, extra: { date, updates } });
    throw error;
  }
};

// Helper function to increment counters
export const incrementDailyCounter = async (
  type: 'pdf_downloads' | 'emails_sent'
) => {
  const pool = getPool();
  const today = new Date().toISOString().split('T')[0];

  // Validate and map the counter type to prevent SQL injection
  const validColumns = {
    'pdf_downloads': 'pdf_downloads',
    'emails_sent': 'emails_sent'
  } as const;

  const column = validColumns[type];
  if (!column) {
    throw new Error(`Invalid counter type: ${type}`);
  }

  try {
    // Get current total users count
    const totalUsers = await getTotalUserCount();

    // Use parameterized queries with explicit column names for security
    if (type === 'pdf_downloads') {
      await pool.query(
        `INSERT INTO public.daily_stats (date, total_users, pdf_downloads)
         VALUES ($1, $2, 1)
         ON CONFLICT (date) DO UPDATE SET
           total_users = $2,
           pdf_downloads = daily_stats.pdf_downloads + 1,
           updated_at = NOW()`,
        [today, totalUsers]
      );
    } else {
      await pool.query(
        `INSERT INTO public.daily_stats (date, total_users, emails_sent)
         VALUES ($1, $2, 1)
         ON CONFLICT (date) DO UPDATE SET
           total_users = $2,
           emails_sent = daily_stats.emails_sent + 1,
           updated_at = NOW()`,
        [today, totalUsers]
      );
    }
  } catch (error) {
    console.error('Error incrementing daily counter:', error);
    Sentry.captureException(error, { tags: { function: 'incrementDailyCounter' }, extra: { type, date: today } });
    throw error;
  }
};

// Helper function to fetch daily stats for a date range
export const getDailyStats = async (startDate: string, endDate?: string) => {
  const pool = getPool();
  
  try {
    const query = endDate
      ? `SELECT * FROM public.daily_stats 
         WHERE date >= $1 AND date <= $2 
         ORDER BY date ASC`
      : `SELECT * FROM public.daily_stats 
         WHERE date >= $1 
         ORDER BY date ASC`;
    
    const params = endDate ? [startDate, endDate] : [startDate];
    const result = await pool.query(query, params);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    Sentry.captureException(error, { tags: { function: 'getDailyStats' }, extra: { startDate, endDate } });
    throw error;
  }
};

// Helper function to get aggregated metrics
export const getAggregatedMetrics = async (startDate: string) => {
  const pool = getPool();
  
  try {
    const result = await pool.query(
      `SELECT 
         SUM(pdf_downloads) as total_downloads,
         SUM(emails_sent) as total_emails
       FROM public.daily_stats
       WHERE date >= $1`,
      [startDate]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching aggregated metrics:', error);
    Sentry.captureException(error, { tags: { function: 'getAggregatedMetrics' }, extra: { startDate } });
    throw error;
  }
};

type ActivityEvent = 'generate_pdf' | 'send_email';

export const upsertUserActivity = async (params: {
  userId: string;
  event: ActivityEvent;
}) => {
  const pool = getPool();
  const { userId, event } = params;

  const counterColumn = event === 'generate_pdf' ? 'total_generates' : 'total_emails';

  try {
    await pool.query(
      `INSERT INTO public.user_activity (user_id, last_seen_at, last_event, last_event_at, ${counterColumn})
       VALUES ($1, NOW(), $2, NOW(), 1)
       ON CONFLICT (user_id) DO UPDATE SET
         last_seen_at = NOW(),
         last_event = EXCLUDED.last_event,
         last_event_at = NOW(),
         ${counterColumn} = public.user_activity.${counterColumn} + 1,
         updated_at = NOW()`,
      [userId, event]
    );
  } catch (error) {
    console.error('Error upserting user activity:', error);
    Sentry.captureException(error, {
      tags: { function: 'upsertUserActivity' },
      extra: { userId, event },
    });
    throw error;
  }
};

export const getActiveUsersCount = async (days: number): Promise<number> => {
  const pool = getPool();

  // Guardrails
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(365, Math.floor(days))) : 30;

  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM public.user_activity
       WHERE last_seen_at >= NOW() - ($1 || ' days')::interval`,
      [safeDays]
    );
    return result.rows?.[0]?.count ?? 0;
  } catch (error) {
    console.error('Error fetching active users count:', error);
    Sentry.captureException(error, { tags: { function: 'getActiveUsersCount' }, extra: { days: safeDays } });
    return 0;
  }
};
