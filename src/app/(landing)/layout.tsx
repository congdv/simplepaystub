'use client';
import { AppLoading } from '@/components/app-loading';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { KofiButton } from '@/components/kofi-button';
import { CreditsProvider } from '@/contexts/credits-context';
import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { LocalStorageManager, STORAGE_KEYS } from '@/lib/local-storage-manage';
import { PayStubSchema } from '@/schemas';
import { PayStubType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Toaster } from 'sonner';


export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const form = useForm<PayStubType>({
    resolver: zodResolver(PayStubSchema),
    defaultValues: PAY_STUB_FORM_DEFAULT_VALUES,
    mode: 'all',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFormData = LocalStorageManager.getItem(STORAGE_KEYS.FORM_DATA, PAY_STUB_FORM_DEFAULT_VALUES);
    form.reset(savedFormData);

    setIsDataLoaded(true);
  }, [form]);

  // Save data to localStorage when form values change
  useEffect(() => {
    if (!isDataLoaded) return;

    let timeoutId: NodeJS.Timeout;

    const subscription = form.watch((data) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        LocalStorageManager.setItem(STORAGE_KEYS.FORM_DATA, data);
      }, 1000)

    });

    return () => { clearTimeout(timeoutId); subscription.unsubscribe() };
  }, [form, isDataLoaded]);

  if (!isDataLoaded) {
    return (
      <>
        <AppLoading />
      </>
    );
  }

  return (
    <CreditsProvider>
      <Header />
      <main>
        <Toaster position="top-center" richColors />
        <FormProvider {...form}>{children}</FormProvider>
      </main>
      <Footer />
      <KofiButton />
    </CreditsProvider>
  );
}
