import { stripe } from '@/lib/stripe';
import { addCredits } from '@/lib/credits';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CREDIT_PACKS, PackId } from '@/lib/credits';

export const runtime = 'nodejs';

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

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode !== 'payment') {
        return NextResponse.json({ received: true });
      }

      const userId = session.metadata?.user_id ?? session.client_reference_id;
      const packId = session.metadata?.pack_id as PackId | undefined;
      const paymentIntentId = session.payment_intent as string | undefined;

      if (!userId || !packId) {
        console.error('Webhook: missing user_id or pack_id in session metadata', session.id);
        return NextResponse.json({ received: true });
      }

      const pack = CREDIT_PACKS[packId];
      if (!pack) {
        console.error('Webhook: unknown pack_id', packId);
        return NextResponse.json({ received: true });
      }

      await addCredits(userId, pack.credits, `purchase_${packId}`, paymentIntentId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
