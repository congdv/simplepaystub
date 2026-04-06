import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import Stripe from 'stripe';

export const runtime = 'nodejs';

let pool: Pool | null = null;
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
};

async function upsertSubscription(
  db: Pool,
  userId: string,
  stripeCustomerId: string,
  sub: Stripe.Subscription
) {
  const plan = sub.status === 'active' || sub.status === 'trialing' ? 'pro' : 'free';
  const item = sub.items.data[0];
  // current_period_start/end moved to SubscriptionItem in Stripe Basil API
  const periodStart = item?.current_period_start ?? null;
  const periodEnd = item?.current_period_end ?? null;

  await db.query(
    `INSERT INTO public.subscriptions
       (user_id, stripe_customer_id, stripe_subscription_id, status, plan,
        price_id, interval, current_period_start, current_period_end, cancel_at_period_end)
     VALUES ($1, $2, $3, $4, $5, $6, $7, to_timestamp($8), to_timestamp($9), $10)
     ON CONFLICT (user_id) DO UPDATE SET
       stripe_customer_id    = EXCLUDED.stripe_customer_id,
       stripe_subscription_id = EXCLUDED.stripe_subscription_id,
       status                = EXCLUDED.status,
       plan                  = EXCLUDED.plan,
       price_id              = EXCLUDED.price_id,
       interval              = EXCLUDED.interval,
       current_period_start  = EXCLUDED.current_period_start,
       current_period_end    = EXCLUDED.current_period_end,
       cancel_at_period_end  = EXCLUDED.cancel_at_period_end,
       updated_at            = NOW()`,
    [
      userId,
      stripeCustomerId,
      sub.id,
      sub.status,
      plan,
      item?.price?.id ?? null,
      item?.price?.recurring?.interval ?? null,
      periodStart,
      periodEnd,
      sub.cancel_at_period_end,
    ]
  );
}

async function getUserIdByCustomerId(db: Pool, customerId: string): Promise<string | null> {
  const result = await db.query<{ user_id: string }>(
    'SELECT user_id FROM public.subscriptions WHERE stripe_customer_id = $1 LIMIT 1',
    [customerId]
  );
  return result.rows[0]?.user_id ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = getPool();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;

        if (!userId || !customerId || session.mode !== 'subscription') break;

        const subId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subId);
        await upsertSubscription(db, userId, customerId, sub);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const userId = await getUserIdByCustomerId(db, customerId);
        if (!userId) break;
        await upsertSubscription(db, userId, customerId, sub);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await db.query(
          `UPDATE public.subscriptions
           SET status = 'canceled', plan = 'free', updated_at = NOW()
           WHERE stripe_customer_id = $1`,
          [customerId]
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await db.query(
          `UPDATE public.subscriptions
           SET status = 'past_due', updated_at = NOW()
           WHERE stripe_customer_id = $1`,
          [customerId]
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
