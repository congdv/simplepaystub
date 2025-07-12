'use client';

import { Tabs } from './ui/tabs';
import BusinessInfoForm from './sections/business-info-form';
import EmployeeInfoForm from './sections/employee-info-form';
import PaymentSection from './sections/payment-section';
import DeductionsInfoForm from './sections/deductions-info-form';
import BenefitsInfoForm from './sections/benefits-info-form';
import { useFormContext } from 'react-hook-form';
import { PayStubType } from '@/types';
import { PaystubStepperTriggers } from './paystub-stepper-triggers';
import { PaystubStepperContent } from './paystub-stepper-content';
import PayStubTemplate from './templates/PayStubTemplate';

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

type PaystubStepperProps = {
  formValues: PayStubType;
};

export default function PaystubStepperSection({ formValues }: PaystubStepperProps) {
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
    <div className="w-full mt-4">
      <Tabs defaultValue={steps[0].value} className="w-full">
        <PaystubStepperTriggers
          steps={steps.map(({ label, value }) => ({ label, value }))}
          getVariant={getVariant}
        />
        <div className="flex flex-col md:flex-row h-full mx-auto max-w-screen-xl w-full gap-4">
          <div className="w-full md:w-[40%]">
            <PaystubStepperContent
              steps={steps.map(({ value, component }) => ({ value, component }))}
            />
          </div>
          <div className="w-full md:w-[60%] mt-0 md:mt-14 overflow-x-auto">
            <PayStubTemplate {...formValues} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
