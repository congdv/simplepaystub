import { PayStubGenerator } from '@/components/paystub-generator';
import { ToolbarProvider } from '@/contexts/toolbar-context';

export default function Landing() {
  return (
    <ToolbarProvider>
      <PayStubGenerator />
    </ToolbarProvider>
  );
}
