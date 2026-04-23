import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/nextjs';

let adminClient: SupabaseClient | null = null;

const getAdminClient = () => {
  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return adminClient;
};

export const getTotalUserCount = async (): Promise<number> => {
  const supabase = getAdminClient();

  try {
    let total = 0;
    let page = 1;
    const perPage = 1000;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      total += data.users.filter(u => u.email_confirmed_at !== null).length;
      if (data.users.length < perPage) break;
      page++;
    }

    return total;
  } catch (error) {
    console.error('Error fetching user count:', error);
    Sentry.captureException(error, { tags: { function: 'getTotalUserCount' } });
    return 0;
  }
};
