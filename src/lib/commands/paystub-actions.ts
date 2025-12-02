import { PayStubType } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { SupabaseClient } from '@supabase/supabase-js';
import { PAY_STUB_FORM_DEFAULT_VALUES, LOADING_STATES } from '@/constants';

export interface PaystubActionDependencies {
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

// Base action class
export abstract class PaystubAction {
  constructor(protected deps: PaystubActionDependencies) {}

  protected onInvalid = () => {
    toast.warning('Please review invalid fields!');
  };

  abstract execute(...args: any[]): void | Promise<void>;
}

// Reset action
export class ResetAction extends PaystubAction {
  execute(): void {
    const currentTemplate = this.deps.form.getValues("template");
    this.deps.form.reset({ 
      ...PAY_STUB_FORM_DEFAULT_VALUES, 
      template: currentTemplate 
    });
  }
}

// Load sample action
export class LoadSampleAction extends PaystubAction {
  execute(): void {
    this.deps.form.reset(this.deps.mockPayStub);
  }
}

// Download action
export class DownloadAction extends PaystubAction {
  async execute(): Promise<void> {
    const { data: { user }, error } = await this.deps.supabase.auth.getUser();
    
    if (error || !user) {
      this.deps.setShowLoginDialog(true);
      return;
    }

    // Require confirmation before downloading
    this.deps.form.handleSubmit((data) => {
      this.deps.setFormData(data);
      this.deps.setConfirmAction('download');
      this.deps.setConfirmOpen(true);
    }, this.onInvalid)();
  }
}

// Save action
export class SaveAction extends PaystubAction {
  async execute(): Promise<void> {
    const currentFormData = this.deps.form.getValues();
    const isValid = await this.deps.form.trigger();

    if (!isValid) {
      this.onInvalid();
      return;
    }

    try {
      this.deps.savePaystub(currentFormData);
      toast.success('Paystub saved to history successfully!');
      this.deps.form.reset(PAY_STUB_FORM_DEFAULT_VALUES);
    } catch (error) {
      console.error('Error saving paystub:', error);
      toast.error('Failed to save paystub');
    }
  }
}

// Send email action
export class SendEmailAction extends PaystubAction {
  async execute(): Promise<void> {
    const isValid = await this.deps.form.trigger();

    if (!isValid) {
      this.onInvalid();
      return;
    }

    const { data: { user }, error } = await this.deps.supabase.auth.getUser();

    if (error || !user) {
      this.deps.setShowLoginDialog(true);
      return;
    }

    // Require confirmation before sending
    const current = this.deps.form.getValues();
    this.deps.setFormData(current as PayStubType);
    this.deps.setConfirmAction('send');
    this.deps.setConfirmOpen(true);
  }
}

// View paystub action
export class ViewPaystubAction extends PaystubAction {
  execute(id: string): void {
    const paystub = this.deps.getPaystub(id);
    if (paystub) {
      this.deps.form.reset(paystub.data);
    }
  }
}

// Perform download action (after confirmation)
export class PerformDownloadAction extends PaystubAction {
  async execute(data: PayStubType): Promise<void> {
    const { data: { user }, error } = await this.deps.supabase.auth.getUser();
    
    if (error || !user) {
      this.deps.setShowLoginDialog(true);
      return;
    }

    this.deps.setConfirmOpen(false);
    this.deps.setLoadingState(LOADING_STATES.DOWNLOADING);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate paystub PDF.');
      }

      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pay-stub_${timestamp}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      this.deps.setLoadingState(null);
    }
  }
}

// Send email (actual send after confirmation)
export class ActuallySendEmailAction extends PaystubAction {
  async execute(recipientEmail: string | null, recipientName: string | null): Promise<void> {
    const currentFormData = this.deps.form.getValues();
    const isValid = await this.deps.form.trigger();
    
    if (!isValid) {
      this.onInvalid();
      return;
    }
    
    this.deps.setLoadingState(LOADING_STATES.SENDING_EMAIL);
    
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentFormData, recipientEmail, recipientName }),
      });
      
      if (!res.ok) throw new Error('Failed to send email.');
      
      const result = await res.json();
      toast.success(`Email sent successfully to ${result.recipient}. Please check your spam folder if you don't see it in your inbox.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send email.');
    } finally {
      this.deps.setLoadingState(null);
    }
  }
}
