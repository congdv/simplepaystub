'use client';

import BusinessInfoForm from './sections/business-info-form';
import EmployeeInfoForm from './sections/employee-info-form';
import PaymentSection from './sections/payment-section';
import DeductionsInfoForm from './sections/deductions-info-form';
import BenefitsInfoForm from './sections/benefits-info-form';
import { Building2, User, DollarSign, Heart, Minus } from 'lucide-react';
import { TabsContent } from './ui/tabs';

export const PAYSTUB_STEPS = [
  {
    label: 'Business',
    value: 'payer',
    component: BusinessInfoForm,
    icon: Building2,
  },
  {
    label: 'Employee',
    value: 'payee',
    component: EmployeeInfoForm,
    icon: User,
  },
  {
    label: 'Income',
    value: 'payment',
    component: PaymentSection,
    icon: DollarSign,
  },
  {
    label: 'Benefits',
    value: 'benefits',
    component: BenefitsInfoForm,
    icon: Heart,
  },
  {
    label: 'Deductions',
    value: 'deductions',
    component: DeductionsInfoForm,
    icon: Minus,
  },
];

export default function PaystubFormContent() {
  return (
    <div className="pb-2 px-1 md:px-2">
      <div className="md:min-h-[645px]">
        {PAYSTUB_STEPS.map((step) => (
          <TabsContent value={step.value} key={step.value}>
            <div className="rounded-lg bg-white shadow-sm p-2 md:p-4">
              <step.component />
            </div>
          </TabsContent>
        ))}
      </div>
    </div>
  );
}
