import { getDailyStats } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

type DailyData = {
  date: string;
  value: number;
};

type HistoricalData = {
  dailyData: DailyData[];
  dailyAvg: number;
  total: number;
};

type ChartType = 'downloads' | 'emails' | 'users';
type TimeFilter = '7' | '30' | '60' | '90';

export async function GET(req: NextRequest) {
  try {
    // Require authentication to view metrics
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get parameters from query string
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as ChartType || 'downloads';
    const days = searchParams.get('days') as TimeFilter || '7';

    // Validate parameters
    if (!['downloads', 'emails', 'users'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid chart type. Use "downloads", "emails", or "users"' },
        { status: 400 }
      );
    }

    if (!['7', '30', '60', '90'].includes(days)) {
      return NextResponse.json(
        { error: 'Invalid days filter. Use 7, 30, 60, or 90' },
        { status: 400 }
      );
    }

    const daysNum = parseInt(days, 10);

    const timestamp = new Date().toISOString();
    Sentry.logger.info(`[${timestamp}] /api/open/metrics/historical called`, { 
      log_source: 'server', 
      user_id: user.id,
      chart_type: type,
      days_filter: daysNum
    });

    // Calculate date range based on filter
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (daysNum - 1)); // -1 because we include today

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];
    
    console.log('[Historical API] Fetching daily stats from:', startDateStr, 'to:', endDateStr, 'Type:', type, 'Days:', daysNum);
    
    const dailyStats = await getDailyStats(startDateStr, endDateStr);
    
    console.log('[Historical API] Retrieved stats count:', dailyStats.length);

    // Transform the data - fill in missing dates with 0
    const dailyDataMap = new Map<string, number>();
    
    // Initialize all dates with 0 (only for the requested range, including today)
    for (let i = 0; i < daysNum; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyDataMap.set(dateStr, 0);
    }

    // Determine which field to use based on chart type
    const fieldName = type === 'downloads' ? 'pdf_downloads' : type === 'emails' ? 'emails_sent' : 'total_users';

    // Fill in actual data
    dailyStats.forEach((stat: any) => {
      if (stat.date) {
        const dateStr = typeof stat.date === 'string' ? stat.date : stat.date.toISOString().split('T')[0];
        dailyDataMap.set(dateStr, stat[fieldName] || 0);
      }
    });

    // Convert to array sorted by date
    const dailyData: DailyData[] = Array.from(dailyDataMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate total and average
    // For users, total is the last day's value (cumulative)
    // For downloads/emails, total is the sum
    const total = type === 'users' 
      ? (dailyData.length > 0 ? dailyData[dailyData.length - 1].value : 0)
      : dailyData.reduce((sum, item) => sum + item.value, 0);
    
    const daysWithData = dailyData.length || 1;
    const dailyAvg = type === 'users'
      ? Math.round(total / daysWithData)
      : Math.round(dailyData.reduce((sum, item) => sum + item.value, 0) / daysWithData);

    console.log('[Historical API] Total:', total, 'Daily Avg:', dailyAvg, 'Days:', dailyData.length);

    const response: HistoricalData = {
      dailyData,
      dailyAvg,
      total,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 1 minute
      },
    });

  } catch (error) {
    console.error('Error fetching historical data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    Sentry.captureException(error, { tags: { route: '/api/open/metrics/historical' } });
    return NextResponse.json(
      { error: 'Failed to fetch historical data', details: errorMessage },
      { status: 500 }
    );
  }
}
