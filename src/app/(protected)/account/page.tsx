import { createClient } from '@/lib/supabase/server';
import { getCredits, getRecentTransactions } from '@/lib/credits';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CircleDollarSign } from 'lucide-react';
import { Suspense } from 'react';
import paths from '@/paths';
import { PurchaseSuccessHandler } from './purchase-success-handler';
import { UpdatePaymentButton } from './account-actions';
import { type PurchaseRow } from './account-actions';
import { HistoryTabs, type UsageRow } from './history-tabs';

const PACK_INFO: Record<string, { label: string; credits: number; amount: string }> = {
  purchase_starter: { label: 'Starter Pack', credits: 5, amount: '$4.99' },
  purchase_value: { label: 'Value Pack', credits: 20, amount: '$14.99' },
  purchase_pro: { label: 'Pro Pack', credits: 50, amount: '$29.99' },
};

const ACTION_LABELS: Record<string, string> = {
  auto_tax: 'Auto Tax',
  batch_generate: 'Batch Generate',
};

function formatInvoiceId(id: string) {
  return 'inv-' + id.replace(/-/g, '').slice(0, 5).toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
}

function CardBrandBadge({ brand }: { brand: string }) {
  const b = brand.toLowerCase();
  const cls: Record<string, string> = {
    visa: 'bg-blue-700 text-white',
    mastercard: 'bg-red-600 text-white',
    amex: 'bg-blue-400 text-white',
    discover: 'bg-orange-500 text-white',
  };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cls[b] ?? 'bg-slate-600 text-white'}`}>
      {brand.toUpperCase()}
    </span>
  );
}

async function getStripeData(email: string) {
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (!customers.data.length) return null;

    const customer = customers.data[0];
    const charges = await stripe.charges.list({ customer: customer.id, limit: 20 });

    const receiptUrlMap: Record<string, string> = {};
    for (const charge of charges.data) {
      if (charge.payment_intent && typeof charge.payment_intent === 'string' && charge.receipt_url) {
        receiptUrlMap[charge.payment_intent] = charge.receipt_url;
      }
    }

    const lastCharge = charges.data.find(c => c.payment_method_details?.card);
    const card = lastCharge?.payment_method_details?.card
      ? {
          brand: lastCharge.payment_method_details.card.brand ?? 'card',
          last4: lastCharge.payment_method_details.card.last4 ?? '****',
          exp_month: lastCharge.payment_method_details.card.exp_month ?? 0,
          exp_year: lastCharge.payment_method_details.card.exp_year ?? 0,
        }
      : null;

    return { card, billingEmail: customer.email ?? email, receiptUrlMap };
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(paths.signIn);

  const [balance, transactions, stripeData] = await Promise.all([
    getCredits(user.id),
    getRecentTransactions(user.id, 50),
    user.email ? getStripeData(user.email) : Promise.resolve(null),
  ]);

  const purchases: PurchaseRow[] = transactions
    .filter(t => t.action.startsWith('purchase_'))
    .map(t => {
      const pack = PACK_INFO[t.action];
      return {
        invoice: formatInvoiceId(t.id),
        date: formatDate(new Date(t.created_at)),
        description: pack ? `${pack.label} · ${pack.credits} credits` : t.action,
        amount: pack?.amount ?? '—',
        receiptUrl: t.stripe_payment_intent_id
          ? (stripeData?.receiptUrlMap[t.stripe_payment_intent_id] ?? null)
          : null,
      };
    });

  const usage: UsageRow[] = transactions
    .filter(t => t.amount < 0)
    .map(t => ({
      date: formatDate(new Date(t.created_at)),
      action: ACTION_LABELS[t.action] ?? t.action,
      credits: t.amount,
    }));

  const card = stripeData?.card ?? null;
  const billingEmail = stripeData?.billingEmail ?? user.email;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Suspense fallback={null}>
        <PurchaseSuccessHandler />
      </Suspense>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Account &amp; Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage credits, payment methods, and invoices.</p>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Credits balance card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Credits Balance</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{balance}</p>
                <p className="text-sm text-slate-400 mt-1">
                  Enough for {balance} paystub PDF{balance === 1 ? '' : 's'}
                </p>
              </div>
              <div className="bg-primary/10 rounded-full p-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Link
              href={paths.pricing}
              className="w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg py-2.5 transition-colors"
            >
              + Buy credits
            </Link>
          </div>

          {/* Payment method card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment Method</p>

            {card ? (
              <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <CardBrandBadge brand={card.brand} />
                  <span className="text-sm text-slate-700 font-medium tracking-widest">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {card.last4}
                  </span>
                </div>
                <UpdatePaymentButton />
              </div>
            ) : (
              <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5">
                <span className="text-sm text-slate-400">No payment method on file</span>
                <UpdatePaymentButton />
              </div>
            )}

            {card && (
              <p className="text-xs text-slate-500">
                Expires {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).slice(-2)}
              </p>
            )}

            {billingEmail && (
              <p className="text-xs text-slate-500">Billing email: {billingEmail}</p>
            )}
          </div>
        </div>

        {/* History tabs */}
        <HistoryTabs purchases={purchases} usage={usage} pricingHref={paths.pricing} />
      </div>
    </div>
  );
}
