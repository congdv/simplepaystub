import { TabsList, TabsTrigger } from './ui/tabs';
import { cn } from '@/lib/utils';

export function PaystubStepperTriggers({
  steps,
  getVariant,
}: {
  steps: { label: string; value: string }[];
  getVariant: (field: string) => boolean;
}) {
  return (
    <div className="flex w-full justify-center">
      <TabsList className="flex gap-2 h-full bg-background overflow-x-auto px-1 py-2 md:justify-center w-full">
        {steps.map((step) => (
          <TabsTrigger
            value={step.value}
            key={step.value}
            className={cn(
              'px-3 py-2 whitespace-normal text-[#111827] border rounded-md text-xs md:text-sm font-medium transition-colors duration-150 hover:bg-[#111827] hover:text-white data-[state=active]:text-white data-[state=active]:bg-[#111827]',
              getVariant(step.value) &&
                'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
            )}
            // style={{ flex: '0 0 auto' }}
          >
            {step.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
