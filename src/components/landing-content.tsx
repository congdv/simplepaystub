'use client';

import { PayStubType } from '@/types';
import PaystubStepper from './paystub-stepper';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import PayStubTemplate from './templates/PayStubTemplate';
import { Form } from './ui/form';
import Toolbar from './toolbar';
import { useState } from 'react';
import { mockPayStub } from '@/lib/mock';
import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { DownloadConfirmationModal } from './download-confirmation-modal';
import { useUser } from '@clerk/nextjs';

export const LandingContent = () => {
  const form = useFormContext<PayStubType>();
  const { watch } = useFormContext<PayStubType>();
  const formValues = watch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);
  const {isSignedIn} = useUser();

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
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pay-stub.pdf`;
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
  const onReset = () => {
    form.reset(PAY_STUB_FORM_DEFAULT_VALUES);
    setErrorMsg(null);
  };
  const onLoadSample = () => {
    form.reset(mockPayStub);
    setErrorMsg(null);
  };

  const onDownload = (data: PayStubType) => {
    if(!isSignedIn) {
      document.getElementById("user-sign-in")?.click();
      return;
    }
    setConfirmOpen(true);
    setFormData(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onDownload, onInvalid)}>
        <div className="flex flex-col md:flex-row h-full pt-4 md:pt-16 mx-auto max-w-screen-xl w-full gap-4">
          <div className="w-full md:w-[40%]">
            <PaystubStepper />
          </div>
          <div className="w-full md:w-[60%] mt-0 md:mt-32 overflow-x-auto">
            <PayStubTemplate {...formValues} />
            {errorMsg && (
              <div className="w-full flex justify-center mt-2">
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-sm max-w-md text-center">
                  {errorMsg}
                </div>
              </div>
            )}
          </div>
        </div>
        <Toolbar onReset={onReset} isLoading={isLoading} onLoadSample={onLoadSample} />
        <DownloadConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={onSubmit}
        />
      </form>
    </Form>
  );
};
