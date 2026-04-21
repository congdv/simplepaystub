'use client';

import { Download } from 'lucide-react';

export interface PurchaseRow {
  invoice: string;
  date: string;
  description: string;
  amount: string;
  receiptUrl: string | null;
}

export function UpdatePaymentButton() {
  async function handleClick() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }
  return (
    <button
      onClick={handleClick}
      className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
    >
      Update
    </button>
  );
}

export function ExportCsvButton({ rows }: { rows: PurchaseRow[] }) {
  function handleExport() {
    const lines = [
      ['Invoice', 'Date', 'Description', 'Amount', 'Status'].join(','),
      ...rows.map(r =>
        [r.invoice, r.date, `"${r.description}"`, r.amount, 'Paid'].join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-history.csv';
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

export function ReceiptLink({ url }: { url: string | null }) {
  if (!url) {
    return (
      <Download className="h-4 w-4 text-slate-300" />
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-slate-800 transition-colors"
    >
      <Download className="h-4 w-4" />
    </a>
  );
}
