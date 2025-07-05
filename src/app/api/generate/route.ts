import { auth } from "@clerk/nextjs/server";
import { PayStubType } from '@/types';
import { renderToBuffer } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export async function POST(req: NextRequest, res: NextResponse) {
   const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body: PayStubType = await req.json();
  try {
    const { default: PaystubDocument } = await import('@/components/templates/PaystubDocument');
    const pdfBuffer = await renderToBuffer(
      React.createElement(PaystubDocument as React.ComponentType<any>, { ...body })
    );

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=paystub.pdf',
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
