import { Pool } from 'pg';
import * as Sentry from '@sentry/nextjs';

let pool: Pool | null = null;

const getPool = () => {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    pool = new Pool({
      connectionString: databaseUrl,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
};

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
