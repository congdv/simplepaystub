'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import BusinessInfoForm from './sections/business-info-form';
import EmployeeInfoForm from './sections/employee-info-form';
import PaymentSection from './sections/payment-section';
import DeductionsInfoForm from './sections/deductions-info-form';
import BenefitsInfoForm from './sections/benefits-info-form';
import { useFormContext } from 'react-hook-form';
import { PayStubType } from '@/types';
import { cn } from '@/lib/utils';

const steps = [
  {
    label: '1. Business info',
    value: 'payer',
    component: BusinessInfoForm,
  },
  {
    label: '2. Employee info',
    value: 'payee',
    component: EmployeeInfoForm,
  },
  {
    label: '3. Income info',
    value: 'payment',
    component: PaymentSection,
  },
  {
    label: '4. Benefits info',
    value: 'benefits',
    component: BenefitsInfoForm,
  },
  {
    label: '5. Deductions info',
    value: 'deductions',
    component: DeductionsInfoForm,
  },
];

export default function PaystubStepper() {
  const {
    formState: { errors },
  } = useFormContext<PayStubType>();

  const getVariant = (field: string) => {
    if (
      (field === 'payer' && errors.payer) ||
      (field === 'payee' && errors.payee) ||
      (field === 'payment' && errors.payment) ||
      (field === 'deductions' && errors.deductions) ||
      (field === 'benefits' && errors.benefits)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Tabs defaultValue={steps[0].value} className="w-full">
        {/* Mobile-first: horizontal scroll, touch-friendly, responsive */}
        <TabsList className="w-full flex gap-2 h-full bg-background overflow-x-auto scrollbar-hide px-1 py-2 md:overflow-x-visible md:justify-start">
          {steps.map((step) => (
            <TabsTrigger
              value={step.value}
              key={step.value}
              className={cn(
                // Mobile: min-w-[140px], larger touch area, responsive font
                'min-w-[140px] px-3 py-2 whitespace-normal text-[#111827] border rounded-md text-xs md:text-sm font-medium transition-colors duration-150 hover:bg-[#111827] hover:text-white data-[state=active]:text-white data-[state=active]:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                getVariant(step.value) &&
                  'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
              )}
              style={{ flex: '0 0 auto' }}
            >
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="pt-4 pb-2 px-1 md:px-2" style={{ minHeight: '490px' }}>
          {steps.map((step) => (
            <TabsContent value={step.value} key={step.value}>
              <div className="rounded-lg bg-white shadow-sm p-2 md:p-4">
                <step.component />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
