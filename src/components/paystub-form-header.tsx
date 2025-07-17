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
          'text-center text-xs px-2 py-2',
          'lg:w-full lg:text-left lg:justify-start lg:text-sm lg:px-4 lg:py-3 text-black',
          'data-[state=active]:text-blue-500 data-[state=active]:bg-white w-24 hover:text-blue-500',
          getVariant(step.value) && 'text-red-500'
        )}
      >
        <div className="flex lg:flex-col lg:items-center lg:w-full">
          <step.icon className="w-4 h-4" />
          <span className="hidden lg:inline mt-2">{step.label}</span>
        </div>
      </TabsTrigger>
    ));
  }, [getVariant]);

  return (
    <TabsList className="flex-row bg-transparent lg:items-center gap-2 h-auto w-full lg:w-fit p-2 overflow-x-auto  lg:overflow-x-hidden">
      {renderedSteps}
    </TabsList>
  );
})
PaystubFormHeader.displayName = 'PaystubFormHeader';