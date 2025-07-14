import { cn } from '@/lib/utils';
import { PayStubType } from '@/types';
import { useFormContext } from 'react-hook-form';
import { PAYSTUB_STEPS } from './paystub-form-content';
import { TabsList, TabsTrigger } from './ui/tabs';

export function PaystubFormHeader() {
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
    <TabsList className="flex-row bg-transparent lg:items-center gap-2 h-auto w-full lg:w-fit p-2 overflow-x-auto  lg:overflow-x-hidden">
      {PAYSTUB_STEPS.map((step) => (
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
      ))}
    </TabsList>
  );
}
