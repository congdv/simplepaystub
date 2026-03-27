import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { StorageConsentBanner } from '@/components/storage-consent-banner';

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
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://simplepaystub.com'),
  title: {
    default: 'Simple Paystub - Free Paystub Generator',
    template: '%s | Simple Paystub'
  },
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
  authors: [{ name: 'Simple Paystub' }],
  creator: 'Simple Paystub',
  publisher: 'Simple Paystub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Simple Paystub - Free Paystub Generator',
    description: 'Easily create and generate professional paystubs as PDF files.',
    siteName: 'Simple Paystub',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Simple Paystub Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simple Paystub - Free Paystub Generator',
    description: 'Easily create and generate professional paystubs as PDF files.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased font-sans`}>
        {children}
        <StorageConsentBanner />
      </body>
    </html>
  );
}
