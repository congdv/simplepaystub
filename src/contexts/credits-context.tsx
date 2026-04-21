'use client';

import { useCredits } from '@/hooks/use-credits';
import { createContext, ReactNode, useContext } from 'react';

interface CreditsContextType {
  balance: number;
  isLoading: boolean;
  refresh: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const credits = useCredits();
  return <CreditsContext.Provider value={credits}>{children}</CreditsContext.Provider>;
}

export function useCreditsContext() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCreditsContext must be used within a CreditsProvider');
  }
  return context;
}
