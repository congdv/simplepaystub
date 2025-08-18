'use client';

import { LOADING_STATES, PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { usePaystub } from '@/contexts/paystub-context';
import { useToolbar } from '@/contexts/toolbar-context';
import { mockPayStub } from '@/lib/mock';
import { createClient } from '@/lib/supabase/client';
import { PayStubType } from '@/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { DownloadConfirmationModal } from './download-confirmation-modal';
import { LoginDialog } from './login-dialog';
import PaystubFormContent, { PAYSTUB_STEPS } from './paystub-form-content';
import { PaystubFormHeader } from './paystub-form-header';
import { SendEmailDialog } from './send-email-dialog';
import { Form } from './ui/form';
import { Tabs } from './ui/tabs';

export const PaystubForm = () => {
  const supabase = createClient();
  const form = useFormContext<PayStubType>();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);
  const [showSendEmailDialog, setShowSendEmailDialog] = useState(false);

  // Use toolbar context
  const { setLoadingState, setOnReset, setOnLoadSample, setOnDownload, setOnSave, setOnViewPaystub, setOnSendEmail } = useToolbar();
  const { savePaystub, getPaystub } = usePaystub();

  const onSubmit = async () => {
    setConfirmOpen(false);
    setLoadingState(LOADING_STATES.DOWNLOADING);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      setLoadingState(null);
    }
  };
  const onInvalid = () => {
    toast.warning('Please review invalid fields!');
  };

  useEffect(() => {
    const handleReset = () => {
      form.reset(PAY_STUB_FORM_DEFAULT_VALUES);
    };

    const handleLoadSample = () => {
      form.reset(mockPayStub);

    };

    const handleDownload = () => {
      form.handleSubmit(onDownload, onInvalid)();

    };
    const handleViewPaystub = (id: string) => {
      const paystub = getPaystub(id);
      form.reset(paystub?.data)
    }

    const handleOnSave = async () => {
      const currentFormData = form.getValues();

      const isValid = await form.trigger();

      if (!isValid) {
        onInvalid();
        return;
      }

      try {
        const savedId = savePaystub(currentFormData);
        toast.success('Paystub saved to history successfully!');
        form.reset(PAY_STUB_FORM_DEFAULT_VALUES)

      } catch (error) {
        console.error('Error saving paystub:', error);
        toast.error('Failed to save paystub');
      }
    }

    const handleSendEmail = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        setShowLoginDialog(true);
        return;
      }
      setShowSendEmailDialog(true);

    }

    setOnReset(() => handleReset);
    setOnLoadSample(() => handleLoadSample);
    setOnDownload(() => handleDownload);
    setOnSave(() => handleOnSave)
    setOnViewPaystub(() => handleViewPaystub)
    setOnSendEmail(() => handleSendEmail);
  }, [form, setOnReset, setOnLoadSample, setOnDownload]);

  const actuallySendEmail = async (recipientEmail: string | null, recipientName: string | null) => {

    const currentFormData = form.getValues();
    const isValid = await form.trigger();
    if (!isValid) {
      onInvalid();
      return;
    }
    setLoadingState(LOADING_STATES.SENDING_EMAIL);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentFormData, recipientEmail, recipientName }),
      });
      if (!res.ok) throw new Error('Failed to send email.');
      const result = await res.json();
      toast.success(
        <div>
          <div>Email sent successfully to {result.recipient}.</div>
          <div>Please check your spam folder if you don't see it in your inbox.</div>
        </div>
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to send email.');
    } finally {
      setLoadingState(null);
    }
  };

  const onDownload = async (data: PayStubType) => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      setShowLoginDialog(true);
      return;
    }
    setConfirmOpen(true);
    setFormData(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDownload, onInvalid)}>
        <Tabs defaultValue={PAYSTUB_STEPS[0].value}>
          <PaystubFormHeader />

          <PaystubFormContent />
        </Tabs>
        <DownloadConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={onSubmit}
        />
        <LoginDialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          onLoginSuccess={() => {
            setShowLoginDialog(false);
          }}
        />
        <SendEmailDialog
          open={showSendEmailDialog}
          onClose={() => setShowSendEmailDialog(false)}
          onSend={actuallySendEmail}
        />
      </form>
    </Form>
  );
};
