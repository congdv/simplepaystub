import { createClient } from '@/lib/supabase/server';
import { getSubscription, isProUser } from '@/lib/subscription';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await getSubscription(user.id);
    const isPro = isProUser(subscription);

    return NextResponse.json({
      isPro,
      subscription: subscription
        ? {
            status: subscription.status,
            plan: subscription.plan,
            interval: subscription.interval,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
