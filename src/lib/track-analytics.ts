const ANALYTICS_URL = 'https://analytics.congdv.com/api/event';
const SITE_ID = 'simplepaystub.com';

export async function trackAnalyticsEvent(
    userId: string,
    eventName: string,
    prop1: string
): Promise<void> {
    try {
        const apiKey = process.env.ANALYTICS_API_KEY;
        if (!apiKey) return;

        await fetch(ANALYTICS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ siteId: SITE_ID, userId, eventName, prop1 }),
        });
    } catch {
        // Silent — tracking failures must never block the main request
    }
}
