import { TabsContent } from './ui/tabs';

export function PaystubStepperContent({
  steps,
}: {
  steps: { value: string; component: React.ComponentType }[];
}) {
  return (
    <div
      className="pb-2 px-1 md:px-2"
    >
      <div className="md:min-h-[645px]">
        {steps.map((step) => (
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