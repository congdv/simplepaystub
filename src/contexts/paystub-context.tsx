'use client';

import { LocalStorageManager, STORAGE_KEYS } from "@/lib/local-storage-manage";
import { PayStubType } from "@/types";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface PaystubHistoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: PayStubType;
}


interface PaystubContextType {
  isLoading: boolean
  history: PaystubHistoryItem[];
  savePaystub: (data: PayStubType) => string;
  updatePaystub: (id: string, data: PayStubType) => void;
  deletePaystub: (id: string) => void;
  getPaystub: (id: string) => PaystubHistoryItem | undefined;
  clearHistory: () => void;
}

interface PaystubProviderProps {
  children: ReactNode;
}


// Create context for paystub operations
const PaystubContext = createContext<PaystubContextType | undefined>(undefined);

import { useState } from "react";

export function PaystubProvider({ children }: PaystubProviderProps) {
  const [history, setHistory] = useState<PaystubHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistoryFromStorage = () => {
      try {
        const savedHistory = LocalStorageManager.getItem<PaystubHistoryItem[]>(STORAGE_KEYS.PAYSTUB_HISTORY, []);
        const validatedHistory = Array.isArray(savedHistory)
          ? savedHistory.filter(item =>
            item &&
            typeof item.id === 'string' &&
            typeof item.createdAt === 'string' &&
            typeof item.updatedAt === 'string' &&
            item.data
          )
          : [];
        setHistory(validatedHistory)
      } catch (error) {
        console.error('Error loading paystub history:', error);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistoryFromStorage();
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const success = LocalStorageManager.setItem(STORAGE_KEYS.PAYSTUB_HISTORY, history);

      if (!success && history.length > 0) {
        console.warn('Failed to save paystub history. Storage might be full.');
        // Optionally, try to save only recent items
        const recentHistory = history.slice(0, 10);
        LocalStorageManager.setItem(STORAGE_KEYS.PAYSTUB_HISTORY, recentHistory);
        setHistory(recentHistory);
      }
    }
  }, [history, isLoading]);

  const savePaystub = (data: PayStubType): string => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    setHistory(prev => [...prev, { id, createdAt: now, updatedAt: now, data }]);
    return id;
  };

  const updatePaystub = (id: string, data: PayStubType) => {
    setHistory(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            ...data,
            updatedAt: new Date().toISOString(),
            formData: data,
          }
          : item
      )
    );
  };

  const deletePaystub = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const getPaystub = (id: string): PaystubHistoryItem | undefined => {
    return history.find(item => item.id === id);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <PaystubContext.Provider value={{ history, savePaystub, updatePaystub, deletePaystub, getPaystub, clearHistory, isLoading }}>
      {children}
    </PaystubContext.Provider>
  );
}

export const usePaystub = () => {
  const context = useContext(PaystubContext);
  if (!context) {
    throw new Error('usePaystub must be used within PaystubProvider');
  }
  return context;
};
