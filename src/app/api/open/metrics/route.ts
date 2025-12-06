import { getTotalUserCount, getDailyStats, getAggregatedMetrics } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

type WeeklyData = {
  week: number;
  value: number;
};

type DashboardMetrics = {
  weeklyUsers: WeeklyData[];
  weeklyDownloads: WeeklyData[];
  weeklyAvgUsers: number;
  weeklyAvgDownloads: number;
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
    Sentry.logger.info(`[${timestamp}] /api/open/metrics called`, { log_source: 'server', user_id: user.id });

    // Calculate date ranges
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const fortyOneWeeksAgo = new Date(today);
    fortyOneWeeksAgo.setDate(today.getDate() - (41 * 7));

    // Get all daily stats for the past 41 weeks using raw SQL
    const dailyStats = await getDailyStats(fortyOneWeeksAgo.toISOString().split('T')[0]);

    // Get total user count from auth.users
    const totalUsers = await getTotalUserCount();

    // Calculate 30-day totals using raw SQL
    const thirtyDayMetrics = await getAggregatedMetrics(thirtyDaysAgo.toISOString().split('T')[0]);
    const thirtyDayDownloads = parseInt(thirtyDayMetrics.total_downloads || '0', 10);
    const thirtyDayEmails = parseInt(thirtyDayMetrics.total_emails || '0', 10);

    // Calculate all-time totals
    const totalDownloads = dailyStats.reduce((sum: number, stat: any) => sum + (stat.pdf_downloads || 0), 0);
    const totalEmails = dailyStats.reduce((sum: number, stat: any) => sum + (stat.emails_sent || 0), 0);

    // Group data by week for charts (41 weeks)
    const weeklyData: { [key: number]: { users: number; downloads: number; dates: number } } = {};
    
    dailyStats.forEach((stat: any) => {
      const statDate = new Date(stat.date);
      const weeksDiff = Math.floor((today.getTime() - statDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const weekIndex = 40 - weeksDiff; // 0 is oldest, 40 is current week
      
      if (weekIndex >= 0 && weekIndex <= 40) {
        if (!weeklyData[weekIndex]) {
          weeklyData[weekIndex] = { users: 0, downloads: 0, dates: 0 };
        }
        
        // For users, take the maximum total_users in that week (latest cumulative count)
        weeklyData[weekIndex].users = Math.max(weeklyData[weekIndex].users, stat.total_users || 0);
        
        // For downloads, sum them up
        weeklyData[weekIndex].downloads += stat.pdf_downloads || 0;
        weeklyData[weekIndex].dates += 1;
      }
    });

    // Convert to arrays with all 41 weeks (fill missing weeks with 0)
    const weeklyUsers: WeeklyData[] = [];
    const weeklyDownloads: WeeklyData[] = [];
    
    for (let i = 0; i <= 40; i++) {
      weeklyUsers.push({
        week: i,
        value: weeklyData[i]?.users || 0,
      });
      weeklyDownloads.push({
        week: i,
        value: weeklyData[i]?.downloads || 0,
      });
    }

    // Calculate weekly averages (exclude weeks with 0 data)
    const weeksWithData = Object.values(weeklyData).length || 1;
    const weeklyAvgUsers = Math.round(
      weeklyUsers.reduce((sum, w) => sum + w.value, 0) / weeksWithData
    );
    const weeklyAvgDownloads = Math.round(
      weeklyDownloads.reduce((sum, w) => sum + w.value, 0) / weeksWithData
    );

    const metrics: DashboardMetrics = {
      weeklyUsers,
      weeklyDownloads,
      weeklyAvgUsers,
      weeklyAvgDownloads,
      thirtyDayDownloads,
      thirtyDayEmails,
      totalDownloads,
      totalEmails,
      totalUsers,
    };

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 1 minute
      },
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    Sentry.captureException(error, { tags: { route: '/api/open/metrics' } });
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
