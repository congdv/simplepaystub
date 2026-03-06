import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getTotalUserCount } from '@/lib/supabase/admin';

const ANALYTICS_URL = 'https://analytics.congdv.com/api/event';
const ANALYTICS_SITE_ID = 'simplepaystub.com';

export async function GET(req: NextRequest) {
    // Verify CRON_SECRET
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const totalUsers = await getTotalUserCount();

        const analyticsKey = process.env.ANALYTICS_API_KEY;
        if (!analyticsKey) {
            throw new Error('ANALYTICS_API_KEY environment variable is required');
        }

        const response = await fetch(ANALYTICS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${analyticsKey}`,
            },
            body: JSON.stringify({
                siteId: ANALYTICS_SITE_ID,
                userId: 'system',
                eventName: 'total_user',
                prop1: String(totalUsers),
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Analytics API responded with ${response.status}: ${text}`);
        }

        return NextResponse.json({ ok: true, count: totalUsers });
    } catch (error) {
        console.error('Error in sync-analytics cron:', error);
        Sentry.captureException(error, { tags: { function: 'sync-analytics' } });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
