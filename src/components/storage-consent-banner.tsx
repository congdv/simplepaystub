'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function StorageConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('storage-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('storage-consent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm">
          We use local storage to save your paystub data on your device. By continuing, you agree to this.
        </p>
        <Button 
          onClick={handleAccept}
          size="sm"
          variant="secondary"
          className="shrink-0"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
