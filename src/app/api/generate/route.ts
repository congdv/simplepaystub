import { PayStubType } from '@/types';
import { renderToBuffer } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import * as Sentry from "@sentry/nextjs";
import { incrementDailyCounter } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { upsertUserActivity } from '@/lib/supabase/admin';
import { trackAnalyticsEvent } from '@/lib/track-analytics';


export async function POST(req: NextRequest, res: NextResponse) {
  const body: PayStubType = await req.json();
  try {
    // allow optional template selection in the request body: { template: 'NOVA' | 'MONO' }
    const requestedTemplate = (body as any).template || (body as any).templateType || 'NOVA';

    let PaystubDocumentModule: { default: React.ComponentType<any> };
    if (requestedTemplate === 'MONO') {
      PaystubDocumentModule = await import('@/components/templates/pdf/MonoPaystubDocument');
    } else {
      PaystubDocumentModule = await import('@/components/templates/pdf/NovaPaystubDocument');
    }

    const PaystubDocument = PaystubDocumentModule.default;
    const pdfBuffer = await renderToBuffer(
      React.createElement(PaystubDocument as React.ComponentType<any>, { ...body })
    );

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);

    Sentry.logger.info(`[${timestamp}] /api/generate called`, { log_source: 'server' })

    // If the caller is authenticated, record per-user activity for retention tracking.
    // This route remains callable without auth; we only track activity when we can tie it to a user.
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await upsertUserActivity({ userId: user.id, event: 'generate_pdf' });
        void trackAnalyticsEvent(user.id, 'DOWNLOAD_PAYSTUB', `TEMPLATE-${requestedTemplate}`);
      }
    } catch (error) {
      console.error('Failed to track user activity (generate):', error);
      // Don't fail the request if tracking fails
    }

    // Track PDF download in daily stats
    try {
      await incrementDailyCounter('pdf_downloads');
    } catch (error) {
      console.error('Failed to track PDF download:', error);
      // Don't fail the request if tracking fails
    }

    // Return the PDF as a response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=paystub_${timestamp}.pdf`,
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
