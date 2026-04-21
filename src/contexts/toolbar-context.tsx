'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface ToolbarContextType {
  loadingState: string | null;
  setLoadingState: (state: string | null) => void;
  onReset: () => void;
  onSave: () => void;
  onLoadSample: () => void;
  onDownload: () => void;
  setOnReset: (fn: () => void) => void;
  setOnLoadSample: (fn: () => void) => void;
  setOnDownload: (fn: () => void) => void;
  setOnSave: (fn: () => void) => void;
  onViewPaystub: (id: string) => void;
  setOnViewPaystub: (fn: (id: string) => void) => void;
  onSendEmail: () => void;
  setOnSendEmail: (fn: () => void) => void;
  onAutoTax: () => void;
  setOnAutoTax: (fn: () => void) => void;
  onBatchGenerate: () => void;
  setOnBatchGenerate: (fn: () => void) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

interface ToolbarProviderProps {
  children: ReactNode;
}

export function ToolbarProvider({ children }: ToolbarProviderProps) {
  const [loadingState, setLoadingState] = useState<string | null>(null);
  const [onReset, setOnReset] = useState<() => void>(() => () => { });
  const [onLoadSample, setOnLoadSample] = useState<() => void>(() => () => { });
  const [onDownload, setOnDownload] = useState<() => void>(() => () => { });
  const [onSave, setOnSave] = useState<() => void>(() => () => { });
  const [onViewPaystub, setOnViewPaystub] = useState<(id: string) => void>((_id: string) => { });
  const [onSendEmail, setOnSendEmail] = useState<() => void>(() => { });
  const [onAutoTax, setOnAutoTax] = useState<() => void>(() => () => { });
  const [onBatchGenerate, setOnBatchGenerate] = useState<() => void>(() => () => { });

  return (
    <ToolbarContext.Provider
      value={{
        loadingState,
        setLoadingState,
        onReset,
        onLoadSample,
        setOnReset,
        setOnLoadSample,
        onDownload,
        setOnDownload,
        onSave,
        setOnSave,
        onViewPaystub,
        setOnViewPaystub,
        onSendEmail,
        setOnSendEmail,
        onAutoTax,
        setOnAutoTax,
        onBatchGenerate,
        setOnBatchGenerate,
      }}
    >
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbar() {
  const context = useContext(ToolbarContext);
  if (context === undefined) {
    throw new Error('useToolbar must be used within a Toolbar Provider');
  }
  return context;
}
