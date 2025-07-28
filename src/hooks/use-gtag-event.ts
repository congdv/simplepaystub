import { useCallback } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function useGtagEvent() {
  return useCallback(
    (action: string, params: Record<string, any> = {}) => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', action, params);
      }
    },
    []
  );
}