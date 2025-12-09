import { getTotalUserCount, getAggregatedMetrics, getDailyStats } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

type StatsMetrics = {
  thirtyDayDownloads: number;
  thirtyDayEmails: number;
  totalDownloads: number;
  totalEmails: number;
  totalUsers: number;
};

export async function GET(req: NextRequest) {
  try {
    // Require authentication to view metrics
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = new Date().toISOString();
    Sentry.logger.info(`[${timestamp}] /api/open/metrics/stats called`, { log_source: 'server', user_id: user.id });

    // Calculate date ranges
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Get total user count from auth.users
    const totalUsers = await getTotalUserCount();

    // Calculate 30-day totals using raw SQL
    const thirtyDayMetrics = await getAggregatedMetrics(thirtyDaysAgo.toISOString().split('T')[0]);
    const thirtyDayDownloads = parseInt(thirtyDayMetrics.total_downloads || '0', 10);
    const thirtyDayEmails = parseInt(thirtyDayMetrics.total_emails || '0', 10);

    // Get all daily stats to calculate all-time totals
    const fortyOneWeeksAgo = new Date(today);
    fortyOneWeeksAgo.setDate(today.getDate() - (41 * 7));
    const dailyStats = await getDailyStats(fortyOneWeeksAgo.toISOString().split('T')[0]);

    // Calculate all-time totals
    const totalDownloads = dailyStats.reduce((sum: number, stat: any) => sum + (stat.pdf_downloads || 0), 0);
    const totalEmails = dailyStats.reduce((sum: number, stat: any) => sum + (stat.emails_sent || 0), 0);

    const stats: StatsMetrics = {
      thirtyDayDownloads,
      thirtyDayEmails,
      totalDownloads,
      totalEmails,
      totalUsers,
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 1 minute
      },
    });

  } catch (error) {
    console.error('Error fetching stats metrics:', error);
    Sentry.captureException(error, { tags: { route: '/api/open/metrics/stats' } });
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
