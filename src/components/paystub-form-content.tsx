'use client';

import React, { useRef } from 'react';
import { Building2, DollarSign, Heart, Minus, User } from 'lucide-react';
import BenefitsInfoForm from './sections/benefits-info-form';
import BusinessInfoForm from './sections/business-info-form';
import DeductionsInfoForm from './sections/deductions-info-form';
import EmployeeInfoForm from './sections/employee-info-form';
import PaymentSection from './sections/payment-section';
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

interface Props {
  currentTab: string;
  setCurrentTab: (v: string) => void;
}

export default function PaystubFormContent({ currentTab, setCurrentTab }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Focus first focusable element inside the active tab panel
  const focusFirstInActive = () => {
    const active = rootRef.current?.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) return;
    const focusable = active.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) {
      focusable[0].focus();
    }
  };

  const focusToolbarDownload = () => {
    // prefer the toolbar download button by its title attribute
    const toolbarBtn = document.querySelector<HTMLElement>('button[title="Download paystub"]')
      || document.querySelector<HTMLElement>('.toolbar button')
      || document.querySelector<HTMLElement>('button');
    toolbarBtn?.focus();
  };

  // Move focus to next/prev tab when tabbing out of a panel
  const onKeyDown = (e: React.KeyboardEvent, stepIndex: number) => {
    if (e.key !== 'Tab') return;

    const container = e.currentTarget as HTMLElement;
    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isShift = e.shiftKey;

    if (!isShift && document.activeElement === last) {
      // move to next tab
      e.preventDefault();
      const next = PAYSTUB_STEPS[stepIndex + 1];
      if (next) {
        setCurrentTab(next.value);
        // wait for DOM update then focus first element in new tab
        setTimeout(() => focusFirstInActive(), 0);
      }
    } else if (isShift && document.activeElement === first) {
      e.preventDefault();
      const prev = PAYSTUB_STEPS[stepIndex - 1];
      if (prev) {
        setCurrentTab(prev.value);
        setTimeout(() => focusFirstInActive(), 0);
      }
    }
    // if this is the last panel and user tabs forward from last element, focus toolbar
    if (!isShift && stepIndex === PAYSTUB_STEPS.length - 1 && document.activeElement === last) {
      e.preventDefault();
      setTimeout(() => focusToolbarDownload(), 0);
    }
  };

  return (
    <div>
      <div className="md:min-h-[645px]" ref={rootRef}>
        {PAYSTUB_STEPS.map((step, idx) => (
          <TabsContent value={step.value} key={step.value} onKeyDown={(e) => onKeyDown(e, idx)}>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <step.component />
            </div>
          </TabsContent>
        ))}
      </div>
    </div>
  );
}
