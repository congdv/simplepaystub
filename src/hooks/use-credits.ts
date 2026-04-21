'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseCreditsResult {
  balance: number;
  isLoading: boolean;
  refresh: () => void;
}

export function useCredits(): UseCreditsResult {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = useCallback(() => {
    setIsLoading(true);
    fetch('/api/credits/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setBalance(data.balance ?? 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, refresh: fetchBalance };
}
