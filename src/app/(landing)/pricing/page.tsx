'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Zap } from 'lucide-react';
import paths from '@/paths';

const FREE_FEATURES = [
  'Unlimited paystub previews',
  'Unlimited PDF downloads',
  'Email delivery',
  'Nova & Mono templates',
  'Paystub history (local)',
  '3 free credits on sign-up',
];

const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 5,
    price: '$4.99',
    perCredit: '$1.00',
    highlight: false,
  },
  {
    id: 'value',
    name: 'Value',
    credits: 20,
    price: '$14.99',
    perCredit: '$0.75',
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    price: '$29.99',
    perCredit: '$0.60',
    highlight: false,
  },
] as const;

const CREDIT_FEATURES = [
  'Auto-fill payroll contributions (US FICA, Canada CPP/EI)',
  'Bulk generation via CSV upload',
  'Credits never expire',
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleBuy = async (packId: string) => {
    setLoading(packId);
    try {
      const res = await fetch('/api/credits/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });

      if (res.status === 401) {
        router.push(`${paths.signUp}?redirect=${paths.pricing}`);
        return;
      }

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Simple, pay-as-you-go pricing</h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
          All core features are free. Buy credits only when you need Auto Tax or bulk generation.
        </p>
      </div>

      {/* Free tier */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Free — always</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500 mb-1">/ forever</span>
              </div>
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:pt-10">
              <Link
                href={paths.home}
                className="block text-center rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Credit packs */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
          <Zap className="h-3.5 w-3.5" />
          Credits unlock premium features
        </div>
      </div>

      <div className="mb-4 max-w-3xl mx-auto">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
          {CREDIT_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-sm text-slate-600">
              <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {CREDIT_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`rounded-2xl border p-6 flex flex-col ${
              pack.highlight
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="mb-1">
              {pack.highlight && (
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
            </div>
            <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${pack.highlight ? 'text-blue-200' : 'text-slate-500'}`}>
              {pack.name}
            </p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-bold">{pack.price}</span>
            </div>
            <p className={`text-sm mb-4 ${pack.highlight ? 'text-blue-100' : 'text-slate-500'}`}>
              {pack.credits} credits · {pack.perCredit} each
            </p>
            <button
              onClick={() => handleBuy(pack.id)}
              disabled={loading === pack.id}
              className={`mt-auto w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                pack.highlight
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading === pack.id ? 'Redirecting…' : `Buy ${pack.credits} credits`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Prices in USD. Credits never expire. By purchasing you agree to our{' '}
        <Link href={paths.terms} className="underline hover:text-slate-600">Terms</Link>.
      </p>
    </div>
  );
}
