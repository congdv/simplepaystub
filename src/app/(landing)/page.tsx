import PaystubContent from '@/components/paystub-content';
import PaystubHistory from '@/components/paystub-history';
import { PaystubProvider } from '@/contexts/paystub-context';
import { ToolbarProvider } from '@/contexts/toolbar-context';

export default function Landing() {
  return (
    <ToolbarProvider>
      <PaystubProvider>
        <PaystubContent />
        <PaystubHistory />
      </PaystubProvider>
    </ToolbarProvider>
  );
}
