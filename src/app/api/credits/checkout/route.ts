import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packId } = await req.json();
    const pack = CREDIT_PACKS[packId as PackId];
    if (!pack) {
      return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simplepaystub.com';

    const session = await stripe.checkout.sessions.create({
      client_reference_id: user.id,
      customer_email: user.email,
      mode: 'payment',
      line_items: [{ price: pack.priceId, quantity: 1 }],
      success_url: `${siteUrl}/account?purchase=success&pack=${packId}`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: {
        user_id: user.id,
        pack_id: packId,
        credits: String(pack.credits),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
