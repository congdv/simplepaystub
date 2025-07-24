import { createClient } from '@/lib/supabase/server';
import { PayStubType } from '@/types';
import { renderToBuffer } from '@react-pdf/renderer';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

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

    const body: PayStubType = await req.json();

    // Generate PDF
    const { default: PaystubDocument } = await import('@/components/templates/PaystubDocument');
    const pdfBuffer = await renderToBuffer(
      React.createElement(PaystubDocument as React.ComponentType<any>, { ...body })
    );

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const filename = `paystub_${timestamp}.pdf`;


    // Send email with PDF attachment
    const emailData = {
      from: `Otto from SimplePaystub.com <otto@${process.env.MAILGUN_DOMAIN}>`,
      to: user.email!,
      subject: 'Your generator paystub',
      text: 'Please find your paystub attached.',
      html: `
        <p>Hey ${getFirstName(user)},</p>
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

    console.log(`[${timestamp}] PDF sent to ${user.email}`);

    return NextResponse.json({
      message: 'Email sent successfully',
      recipient: user.email
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}