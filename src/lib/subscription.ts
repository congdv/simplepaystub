import { Pool } from 'pg';
import * as Sentry from '@sentry/nextjs';

let pool: Pool | null = null;

const getPool = () => {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL environment variable is required');
    pool = new Pool({
      connectionString: databaseUrl,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
};

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive' | 'unpaid';
  plan: 'free' | 'pro';
  price_id: string | null;
  interval: 'month' | 'year' | null;
  current_period_start: Date | null;
  current_period_end: Date | null;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const db = getPool();
  try {
    const result = await db.query<Subscription>(
      'SELECT * FROM public.subscriptions WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    return result.rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    Sentry.captureException(error, { tags: { function: 'getSubscription' } });
    return null;
  }
}

export function isProUser(subscription: Subscription | null): boolean {
  return subscription?.status === 'active' || subscription?.status === 'trialing';
}

export async function checkProAccess(userId: string): Promise<boolean> {
  const subscription = await getSubscription(userId);
  return isProUser(subscription);
}
