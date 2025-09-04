import localFont from 'next/font/local';
import './globals.css';
import Script from 'next/script';
import { FeedbackButton } from '@/components/feedback-button';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Simple Paystub',
  description: 'Easily create and generate professional paystubs as PDF files.',
  keywords: [
    'free payslip',
    'simple paystub',
    'free paystub',
    'US paystub',
    'Canadian paystub',
    'paystub generator',
    'pdf',
    'salary',
    'payroll',
    'hourly',
    'rate',
    'income paystubs',
    'DIY Payroll',
    'bookkeeping'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <Script
          id="counterscale-script"
          data-site-id={`${process.env.NEXT_PUBLIC_COUNTERSCALE_SITE_ID}`}
          src={`${process.env.NEXT_PUBLIC_COUNTERSCALE_REPORTER_HOST}/tracker.js`}
          defer
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
