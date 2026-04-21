'use client';

import { useCredits } from '@/hooks/use-credits';
import { createClient } from '@/lib/supabase/client';
import { Zap } from 'lucide-react';
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
    <Link
      href={paths.pricing}
      className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      title="Buy more credits"
    >
      <Zap className="h-3.5 w-3.5 text-blue-500" />
      <span>{balance}</span>
    </Link>
  );
}
