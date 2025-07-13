'use client';

import { PayStubType } from '@/types';
import PaystubStepper from './paystub-stepper';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import PayStubTemplate from './templates/PayStubTemplate';
import { Form } from './ui/form';
import Toolbar from './toolbar';
import { useEffect, useState } from 'react';
import { mockPayStub } from '@/lib/mock';
import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { DownloadConfirmationModal } from './download-confirmation-modal';
import { useToolbar } from '@/contexts/toolbar-context';

export const PayStubGenerator = () => {
  const form = useFormContext<PayStubType>();
  const { watch } = useFormContext<PayStubType>();
  const formValues = watch();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);

  // Use toolbar context
  const { setIsLoading, setOnReset, setOnLoadSample } = useToolbar();

  const onSubmit = async () => {
    setConfirmOpen(false);
    setIsLoading(true);
    setErrorMsg(null);
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
      setErrorMsg(err.message || 'An unexpected error occurred.');
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
      setErrorMsg(null);
    };

    const handleLoadSample = () => {
      form.reset(mockPayStub);
      setErrorMsg(null);
    };

    setOnReset(() => handleReset);
    setOnLoadSample(() => handleLoadSample);
  }, [form, setOnReset, setOnLoadSample]);

  const onDownload = (data: PayStubType) => {
    // if(!isSignedIn) {
    //   document.getElementById("user-sign-in")?.click();
    //   return;
    // }
    setConfirmOpen(true);
    setFormData(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDownload, onInvalid)}>
        <PaystubStepper formValues={formValues} />
        {errorMsg && (
          <div className="w-full flex justify-center mt-2">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-sm max-w-md text-center">
              {errorMsg}
            </div>
          </div>
        )}
        <Toolbar />
        <DownloadConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={onSubmit}
        />
      </form>
    </Form>
  );
};
