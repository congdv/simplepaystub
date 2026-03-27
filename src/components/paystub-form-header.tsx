import { cn } from '@/lib/utils';
import { PayStubType } from '@/types';
import { memo, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { PAYSTUB_STEPS } from './paystub-form-content';
import { TabsList, TabsTrigger } from './ui/tabs';

export const PaystubFormHeader = memo(() => {
  const form = useFormContext<PayStubType>();

  const payerError = form.getFieldState('payer').error;
  const payeeError = form.getFieldState('payee').error;
  const paymentError = form.getFieldState('payment').error;
  const deductionsError = form.getFieldState('deductions').error;
  const benefitsError = form.getFieldState('benefits').error;

  const getVariant = useCallback((field: string): boolean => {
    switch (field) {
      case 'payer': return Boolean(payerError);
      case 'payee': return Boolean(payeeError);
      case 'payment': return Boolean(paymentError);
      case 'deductions': return Boolean(deductionsError);
      case 'benefits': return Boolean(benefitsError);
      default: return false;
    }
  }, [payerError, payeeError, paymentError, deductionsError, benefitsError]);

  const renderedSteps = useMemo(() => {
    return PAYSTUB_STEPS.map((step) => (
      <TabsTrigger
        value={step.value}
        key={step.value}
        className={cn(
          'flex flex-col items-center justify-center min-w-[72px] px-3 py-2 rounded-lg text-xs font-medium transition-all',
          'text-slate-500 hover:text-slate-800',
          'data-[state=active]:bg-blue-50 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-blue-100 data-[state=active]:font-semibold',
          getVariant(step.value) && 'text-red-500'
        )}
      >
        <step.icon className="w-5 h-5 mb-1" />
        <span>{step.label}</span>
      </TabsTrigger>
    ));
  }, [getVariant]);

  return (
    <TabsList className="bg-white p-1 rounded-lg flex border border-slate-200 h-auto w-full overflow-x-auto gap-1 mb-4">
      {renderedSteps}
    </TabsList>
  );
});
PaystubFormHeader.displayName = 'PaystubFormHeader';
