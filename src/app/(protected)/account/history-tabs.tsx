'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { type PurchaseRow } from './account-actions';
import { ReceiptLink } from './account-actions';

export interface UsageRow {
  date: string;
  action: string;
  credits: number;
}

function ExportCsvButton({ label, rows }: { label: string; rows: (PurchaseRow | UsageRow)[] }) {
  function handleExport() {
    let lines: string[];
    if (label === 'purchases') {
      const typed = rows as PurchaseRow[];
      lines = [
        ['Invoice', 'Date', 'Description', 'Amount', 'Status'].join(','),
        ...typed.map(r => [r.invoice, r.date, `"${r.description}"`, r.amount, 'Paid'].join(',')),
      ];
    } else {
      const typed = rows as UsageRow[];
      lines = [
        ['Date', 'Action', 'Credits Used'].join(','),
        ...typed.map(r => [r.date, `"${r.action}"`, r.credits].join(',')),
      ];
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${label}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}

function EmptyState({ cta }: { cta?: React.ReactNode }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-slate-400">
      {cta ?? 'No records yet.'}
    </div>
  );
}

export function HistoryTabs({
  purchases,
  usage,
  pricingHref,
}: {
  purchases: PurchaseRow[];
  usage: UsageRow[];
  pricingHref: string;
}) {
  const [tab, setTab] = useState<'purchases' | 'usage'>('purchases');

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
          <TabsList className="h-8">
            <TabsTrigger value="purchases" className="text-xs px-3 py-1">Purchase history</TabsTrigger>
            <TabsTrigger value="usage" className="text-xs px-3 py-1">Usage history</TabsTrigger>
          </TabsList>
        </Tabs>
        <ExportCsvButton
          label={tab}
          rows={tab === 'purchases' ? purchases : usage}
        />
      </div>

      <Tabs value={tab}>
        <TabsContent value="purchases" className="mt-0">
          {purchases.length === 0 ? (
            <EmptyState
              cta={
                <>
                  No purchases yet.{' '}
                  <a href={pricingHref} className="text-indigo-600 hover:underline">Buy credits</a> to get started.
                </>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Invoice', 'Date', 'Description', 'Amount', 'Status', ''].map((h, i) => (
                      <th key={i} className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400 px-5 first:px-5 px-3 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-600 font-medium">{row.invoice}</td>
                      <td className="px-3 py-3.5 text-slate-600">{row.date}</td>
                      <td className="px-3 py-3.5 text-slate-700">{row.description}</td>
                      <td className="px-3 py-3.5 text-slate-700 font-medium">{row.amount}</td>
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Paid
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <ReceiptLink url={row.receiptUrl} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage" className="mt-0">
          {usage.length === 0 ? (
            <EmptyState cta="No credits used yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Date', 'Action', 'Credits'].map((h, i) => (
                      <th key={i} className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400 px-5 first:px-5 px-3 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usage.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-600">{row.date}</td>
                      <td className="px-3 py-3.5 text-slate-700">{row.action}</td>
                      <td className="px-3 py-3.5">
                        <span className="text-red-600 font-medium">{row.credits}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
