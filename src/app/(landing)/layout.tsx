'use client';
import { Footer } from '@/components/footer';
import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { PayStubSchema } from '@/schemas';
import { PayStubType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { PaystubFormSkeleton } from '@/components/paystub-form-skeleton';

const STORAGE_KEY = 'SimplePaystub.com';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const form = useForm<PayStubType>({
    resolver: zodResolver(PayStubSchema),
    defaultValues: PAY_STUB_FORM_DEFAULT_VALUES,
    mode: 'all',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }
    setIsDataLoaded(true);
  }, [form]);

  // Save data to localStorage when form values change
  useEffect(() => {
    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isDataLoaded]);

  if (!isDataLoaded) {
    return (
      <>
        <main>
          <PaystubFormSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main>
        <Toaster position="top-center" richColors />
        <FormProvider {...form}>{children}</FormProvider>
      </main>
      <Footer />
    </>
  );
}
