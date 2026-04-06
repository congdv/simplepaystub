'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import paths from '@/paths';

const FREE_FEATURES = [
  'Unlimited paystub previews',
  'Unlimited PDF downloads',
  'Email delivery',
  'Nova & Mono templates',
  'Paystub history (local)',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Auto tax calculations (federal, FICA, state)',
  'Bulk generation via CSV upload',
  'Premium template library',
  'Secure email delivery with expiring links',
  'Priority support',
];

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!;
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID!;

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const priceId = annual ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID;
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (res.status === 401) {
        router.push(`${paths.signUp}?redirect=${paths.pricing}`);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
          Start for free. Upgrade when you need powerful automation and compliance tools.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={cn('text-sm font-medium', !annual ? 'text-slate-900' : 'text-slate-400')}>Monthly</span>
        <button
          onClick={() => setAnnual((v) => !v)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
            annual ? 'bg-blue-600' : 'bg-slate-300'
          )}
          aria-label="Toggle annual billing"
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              annual ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
        <span className={cn('text-sm font-medium', annual ? 'text-slate-900' : 'text-slate-400')}>
          Annual <span className="ml-1 text-xs text-green-600 font-semibold">Save 33%</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Free</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500 mb-1">/ forever</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Everything you need to create professional paystubs.</p>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href={paths.home}
            className="block text-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Get started free
          </Link>
        </div>

        {/* Pro */}
        <div className="bg-blue-600 rounded-2xl border border-blue-600 p-8 flex flex-col text-white shadow-lg shadow-blue-200">
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-1">Pro</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold">{annual ? '$6.67' : '$9.99'}</span>
              <span className="text-blue-200 mb-1">/ month</span>
            </div>
            {annual && (
              <p className="text-xs text-blue-200 mt-1">Billed $79.99 annually</p>
            )}
            <p className="text-sm text-blue-100 mt-2">Advanced automation, compliance, and premium features.</p>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-blue-50">
                <Check className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="block w-full text-center rounded-lg bg-white text-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors disabled:opacity-60"
          >
            {loading ? 'Redirecting…' : `Get Pro — ${annual ? '$79.99/yr' : '$9.99/mo'}`}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Prices in USD. Cancel anytime. By subscribing you agree to our{' '}
        <Link href={paths.terms} className="underline hover:text-slate-600">Terms</Link>.
      </p>
    </div>
  );
}
