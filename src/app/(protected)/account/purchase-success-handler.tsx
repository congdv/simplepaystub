'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function PurchaseSuccessHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('purchase') === 'success') {
      const pack = searchParams.get('pack');
      const credits: Record<string, string> = { starter: '5', value: '20', pro: '50' };
      const n = pack ? credits[pack] : null;
      toast.success(n ? `${n} credits added to your account!` : 'Credits added successfully!');
    }
  }, [searchParams]);
  return null;
}
