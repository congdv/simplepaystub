'use client';

import { useEffect, useState } from 'react';

interface SubscriptionInfo {
  status: string;
  plan: string;
  interval: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface UseSubscriptionResult {
  isPro: boolean;
  isLoading: boolean;
  subscription: SubscriptionInfo | null;
}

export function useSubscription(): UseSubscriptionResult {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    fetch('/api/stripe/status')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          setIsPro(data.isPro ?? false);
          setSubscription(data.subscription ?? null);
        }
      })
      .catch(() => {
        // silently fail — user is treated as free
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { isPro, isLoading, subscription };
}
