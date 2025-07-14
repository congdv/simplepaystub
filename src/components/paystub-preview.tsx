import { useFormContext } from 'react-hook-form';
import PayStubTemplate from './templates/PayStubTemplate';
import { PayStubType } from '@/types';

export default function PaystubPreview() {
  const { watch } = useFormContext<PayStubType>();
  const formValues = watch();
  return <PayStubTemplate {...formValues} />;
}
