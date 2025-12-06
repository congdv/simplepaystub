import { createClient } from '@supabase/supabase-js';
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
    });
  }
  return pool;
};

// Create a Supabase client with service role key for admin operations
// This bypasses RLS and should only be used in server-side API routes
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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

  try {
    // Get current total users count
    const totalUsers = await getTotalUserCount();

    // Increment the appropriate counter using raw SQL
    const column = type === 'pdf_downloads' ? 'pdf_downloads' : 'emails_sent';
    
    await pool.query(
      `INSERT INTO public.daily_stats (date, total_users, ${column})
       VALUES ($1, $2, 1)
       ON CONFLICT (date) DO UPDATE SET
         total_users = $2,
         ${column} = daily_stats.${column} + 1,
         updated_at = NOW()`,
      [today, totalUsers]
    );
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
