'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface ToolbarContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onReset: () => void;
  onSave: () => void;
  onLoadSample: () => void;
  onDownload: () => void;
  setOnReset: (fn: () => void) => void;
  setOnLoadSample: (fn: () => void) => void;
  setOnDownload: (fn: () => void) => void;
  setOnSave: (fn: () => void) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

interface ToolbarProviderProps {
  children: ReactNode;
}

export function ToolbarProvider({ children }: ToolbarProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [onReset, setOnReset] = useState<() => void>(() => () => { });
  const [onLoadSample, setOnLoadSample] = useState<() => void>(() => () => { });
  const [onDownload, setOnDownload] = useState<() => void>(() => () => { });
  const [onSave, setOnSave] = useState<() => void>(() => () => { });

  return (
    <ToolbarContext.Provider
      value={{
        isLoading,
        setIsLoading,
        onReset,
        onLoadSample,
        setOnReset,
        setOnLoadSample,
        onDownload,
        setOnDownload,
        onSave,
        setOnSave
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
