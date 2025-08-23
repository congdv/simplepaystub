import { PayStubType } from '@/types';
import { renderToBuffer } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

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

    console.log(`[${timestamp}] /api/generate called`);

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
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
