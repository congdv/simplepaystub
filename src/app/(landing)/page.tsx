import PaystubContent from '@/components/paystub-content';
import { ToolbarProvider } from '@/contexts/toolbar-context';

export default function Landing() {
  return (
    <ToolbarProvider>
      <PaystubContent />
    </ToolbarProvider>
  );
}
