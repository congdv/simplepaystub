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
  const [confirmAction, setConfirmAction] = useState<'download' | 'send' | null>(null);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);
  const [showSendEmailDialog, setShowSendEmailDialog] = useState(false);

  // Use toolbar context
  const { setLoadingState, setOnReset, setOnLoadSample, setOnDownload, setOnSave, setOnViewPaystub, setOnSendEmail } = useToolbar();
  const { savePaystub, getPaystub } = usePaystub();

  // Consolidated download helper: checks auth and requests PDF generation
  const performDownload = async (data: PayStubType) => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      setShowLoginDialog(true);
      return;
    }

    setConfirmOpen(false);
    setLoadingState(LOADING_STATES.DOWNLOADING);
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
      setLoadingState(null);
    }
  };
  const onInvalid = () => {
    toast.warning('Please review invalid fields!');
  };

  // Check auth first, then open confirmation modal for download
  const handleDownload = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      setShowLoginDialog(true);
      return;
    }

    // require confirmation before downloading
    form.handleSubmit((data) => {
      setFormData(data);
      setConfirmAction('download');
      setConfirmOpen(true);
    }, onInvalid)();
  };

  useEffect(() => {
    const handleReset = () => {
      form.reset({ ...PAY_STUB_FORM_DEFAULT_VALUES, template: form.getValues("template") });
    };

    const handleLoadSample = () => {
      form.reset(mockPayStub);

    };

    // ... handleDownload is defined in component scope
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
      const isValid = await form.trigger();

      if (!isValid) {
        onInvalid();
        return;
      }

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        setShowLoginDialog(true);
        return;
      }
      // require confirmation before sending
      const current = form.getValues();
      setFormData(current as PayStubType);
      setConfirmAction('send');
      setConfirmOpen(true);

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
    // Keep formData in state for the confirm flow
    setFormData(data);
    // Delegate to shared helper which performs auth check and download
    await performDownload(data);
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
          onConfirm={() => {
            setConfirmOpen(false);
            if (confirmAction === 'download') {
              // perform download using stored formData
              performDownload(formData);
            } else if (confirmAction === 'send') {
              // open send dialog to collect recipient info
              setShowSendEmailDialog(true);
            }
            setConfirmAction(null);
          }}
          confirmLabel={confirmAction === 'send' ? 'Agree & Send' : 'Agree & Download'}
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
    </Form >
  );
};
