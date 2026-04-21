import { Pool } from 'pg';
import * as Sentry from '@sentry/nextjs';

export const CREDIT_PACKS = {
  starter: {
    priceId: process.env.STRIPE_CREDITS_STARTER_PRICE_ID!,
    credits: 5,
    label: 'Starter Pack',
  },
  value: {
    priceId: process.env.STRIPE_CREDITS_VALUE_PRICE_ID!,
    credits: 20,
    label: 'Value Pack',
  },
  pro: {
    priceId: process.env.STRIPE_CREDITS_PRO_PRICE_ID!,
    credits: 50,
    label: 'Pro Pack',
  },
} as const;

export type PackId = keyof typeof CREDIT_PACKS;

const SIGNUP_BONUS = 3;

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

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  action: string;
  stripe_payment_intent_id: string | null;
  created_at: Date;
}

export async function getCredits(userId: string): Promise<number> {
  const db = getPool();
  try {
    const result = await db.query<{ balance: number }>(
      'SELECT balance FROM public.credits WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    if (result.rows[0]) return result.rows[0].balance;

    // First time — grant signup bonus
    await db.query(
      `INSERT INTO public.credits (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING`,
      [userId, SIGNUP_BONUS]
    );
    await db.query(
      `INSERT INTO public.credit_transactions (user_id, amount, action) VALUES ($1, $2, 'signup_bonus')`,
      [userId, SIGNUP_BONUS]
    );
    return SIGNUP_BONUS;
  } catch (error) {
    Sentry.captureException(error, { tags: { function: 'getCredits' } });
    throw error;
  }
}

export async function deductCredit(userId: string, action: string): Promise<number> {
  const db = getPool();
  const result = await db.query<{ balance: number }>(
    `UPDATE public.credits
     SET balance = balance - 1, updated_at = NOW()
     WHERE user_id = $1 AND balance >= 1
     RETURNING balance`,
    [userId]
  );
  if (result.rowCount === 0) {
    throw new Error('Insufficient credits');
  }
  const newBalance = result.rows[0].balance;
  await db.query(
    `INSERT INTO public.credit_transactions (user_id, amount, action) VALUES ($1, -1, $2)`,
    [userId, action]
  );
  return newBalance;
}

export async function addCredits(
  userId: string,
  amount: number,
  action: string,
  stripePaymentIntentId?: string
): Promise<number> {
  const db = getPool();
  const result = await db.query<{ balance: number }>(
    `INSERT INTO public.credits (user_id, balance)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE
       SET balance = public.credits.balance + EXCLUDED.balance, updated_at = NOW()
     RETURNING balance`,
    [userId, amount]
  );
  await db.query(
    `INSERT INTO public.credit_transactions (user_id, amount, action, stripe_payment_intent_id)
     VALUES ($1, $2, $3, $4)`,
    [userId, amount, action, stripePaymentIntentId ?? null]
  );
  return result.rows[0].balance;
}

export async function getRecentTransactions(userId: string, limit = 10): Promise<CreditTransaction[]> {
  const db = getPool();
  const result = await db.query<CreditTransaction>(
    `SELECT * FROM public.credit_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}
