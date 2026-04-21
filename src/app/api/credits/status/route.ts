import { createClient } from '@/lib/supabase/server';
import { getCredits } from '@/lib/credits';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const balance = await getCredits(user.id);
    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Error fetching credit balance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
