import { createClient } from '@/lib/supabase/server';
import { deductCredit } from '@/lib/credits';
import { trackAnalyticsEvent } from '@/lib/track-analytics';
import { NextRequest, NextResponse } from 'next/server';

const ACTION_EVENT_MAP: Record<string, string> = {
  auto_tax: 'USE_AUTO_TAX',
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();
    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    const balance = await deductCredit(user.id, action);

    const eventName = ACTION_EVENT_MAP[action];
    if (eventName) {
      void trackAnalyticsEvent(user.id, eventName, action);
    }

    return NextResponse.json({ balance });
  } catch (error: any) {
    if (error?.message === 'Insufficient credits') {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }
    console.error('Error deducting credit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
