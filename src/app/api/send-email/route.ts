import { createClient } from '@/lib/supabase/server';
import { PayStubType } from '@/types';
import { renderToBuffer } from '@react-pdf/renderer';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import * as Sentry from "@sentry/nextjs";
import { incrementDailyCounter, upsertUserActivity } from '@/lib/supabase/admin';
import { trackAnalyticsEvent } from '@/lib/track-analytics';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

type UserType = {
  user_metadata?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
  email?: string;
};

type ExtendedPayStubType = PayStubType & {
  recipientEmail?: string | null;
  recipientName?: string | null;
}

const getFirstName = (user: UserType) => {
  if (user?.user_metadata?.full_name) {
    return user.user_metadata.full_name.split(" ")[0];
  }
  if (user?.user_metadata?.first_name) {
    return `${user.user_metadata.first_name}`;
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    // Get the logged-in user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ExtendedPayStubType = await req.json();

    // Generate PDF (allow selecting template via body.template: 'NOVA' | 'MONO')
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
    const filename = `paystub_${timestamp}.pdf`;
    const isSendToOther = !!body.recipientEmail;
    const toEmail = isSendToOther ? body.recipientEmail ?? undefined : user.email!;
    const ccEmail = isSendToOther ? user.email! : undefined;
    const recipientName = isSendToOther ? body.recipientName : getFirstName(user);

    // Send email with PDF attachment
    const emailData = {
      from: `Otto from SimplePaystub.com <otto@${process.env.MAILGUN_DOMAIN}>`,
      to: toEmail,
      ...(ccEmail ? { cc: ccEmail } : {}),
      subject: 'Your generated paystub',
      text: 'Please find your paystub attached.',
      html: `
        <p>Hey ${recipientName},</p>
        <p>Your paystub has been generated successfully. Please find it attached to this email.</p>
        <p>Thank you for using SimplePaystub!</p>
        <p>Best regards,<br/>Otto from The SimplePaystub Team</p>
      `,
      attachment: [
        {
          data: pdfBuffer,
          filename,
          contentType: 'application/pdf',
        },
      ],
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, emailData);

    Sentry.logger.info(`[${timestamp}] /api/send-email called`, { log_source: 'server' });

    void trackAnalyticsEvent(user.id, 'SEND_EMAIL_PAYSTUB', `TEMPLATE-${requestedTemplate}`);

    // Record per-user activity for retention tracking
    try {
      await upsertUserActivity({ userId: user.id, event: 'send_email' });
    } catch (error) {
      console.error('Failed to track user activity (send email):', error);
      // Don't fail the request if tracking fails
    }

    // Track email sent in daily stats
    try {
      await incrementDailyCounter('emails_sent');
    } catch (error) {
      console.error('Failed to track email send:', error);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      message: 'Email sent successfully',
      recipient: user.email
    });

  } catch (error) {
    console.error('Error sending email:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}