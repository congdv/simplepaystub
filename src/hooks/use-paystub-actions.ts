import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SupabaseClient } from '@supabase/supabase-js';
import { PayStubType } from '@/types';
import {
  PaystubActionDependencies,
  ResetAction,
  LoadSampleAction,
  DownloadAction,
  SaveAction,
  SendEmailAction,
  ViewPaystubAction,
  PerformDownloadAction,
  ActuallySendEmailAction,
} from '@/lib/commands/paystub-actions';

interface UsePaystubActionsProps {
  form: UseFormReturn<PayStubType>;
  supabase: SupabaseClient;
  setShowLoginDialog: (show: boolean) => void;
  setConfirmOpen: (open: boolean) => void;
  setConfirmAction: (action: 'download' | 'send' | null) => void;
  setFormData: (data: PayStubType) => void;
  setLoadingState: (state: string | null) => void;
  savePaystub: (data: PayStubType) => string;
  getPaystub: (id: string) => PaystubHistoryItem | undefined;
  mockPayStub: PayStubType;
}

interface PaystubHistoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: PayStubType;
}

export const usePaystubActions = (props: UsePaystubActionsProps) => {
  const deps: PaystubActionDependencies = {
    form: props.form,
    supabase: props.supabase,
    setShowLoginDialog: props.setShowLoginDialog,
    setConfirmOpen: props.setConfirmOpen,
    setConfirmAction: props.setConfirmAction,
    setFormData: props.setFormData,
    setLoadingState: props.setLoadingState,
    savePaystub: props.savePaystub,
    getPaystub: props.getPaystub,
    mockPayStub: props.mockPayStub,
  };

  const actions = useMemo(() => ({
    reset: new ResetAction(deps),
    loadSample: new LoadSampleAction(deps),
    download: new DownloadAction(deps),
    save: new SaveAction(deps),
    sendEmail: new SendEmailAction(deps),
    viewPaystub: new ViewPaystubAction(deps),
    performDownload: new PerformDownloadAction(deps),
    actuallySendEmail: new ActuallySendEmailAction(deps),
  }), [
    props.form,
    props.supabase,
    props.setShowLoginDialog,
    props.setConfirmOpen,
    props.setConfirmAction,
    props.setFormData,
    props.setLoadingState,
    props.savePaystub,
    props.getPaystub,
    props.mockPayStub,
  ]);

  return actions;
};
