'use client';

import { PayStubType } from '@/types';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import { Form } from './ui/form';
import Toolbar from './toolbar';
import { useEffect, useState } from 'react';
import { mockPayStub } from '@/lib/mock';
import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { DownloadConfirmationModal } from './download-confirmation-modal';
import { useToolbar } from '@/contexts/toolbar-context';
import { Tabs } from './ui/tabs';
import { PaystubFormHeader } from './paystub-form-header';
import PaystubFormContent, { PAYSTUB_STEPS } from './paystub-form-content';

export const PaystubForm = () => {
  const form = useFormContext<PayStubType>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);

  // Use toolbar context
  const { setIsLoading, setOnReset, setOnLoadSample, setOnDownload } = useToolbar();

  const onSubmit = async () => {
    setConfirmOpen(false);
    setIsLoading(true);
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
      setIsLoading(false);
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

    setOnReset(() => handleReset);
    setOnLoadSample(() => handleLoadSample);
    setOnDownload(() => handleDownload);
  }, [form, setOnReset, setOnLoadSample, setOnDownload]);

  const onDownload = (data: PayStubType) => {
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
      </form>
    </Form>
  );
};
