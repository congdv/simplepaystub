'use client';

import { useCredits } from '@/hooks/use-credits';
import { createClient } from '@/lib/supabase/client';
import { CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import paths from '@/paths';

export function CreditBalance() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { balance, isLoading } = useCredits();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked || !loggedIn || isLoading) return null;

  return (
    <div className="flex items-center rounded-full border border-slate-200 shadow-sm overflow-hidden text-sm font-medium">
      <span className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700">
        <CircleDollarSign className="h-4 w-4 text-slate-500" />
        {balance} credits
      </span>
      <span className="w-px h-5 bg-slate-200" />
      <Link
        href={paths.pricing}
        className="px-3 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        Buy
      </Link>
    </div>
  );
}
