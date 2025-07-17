import { PayStubType } from '@/types';
import { useFormContext } from 'react-hook-form';
import PayStubTemplate from './templates/PayStubTemplate';

export default function PaystubPreview() {
  const { watch } = useFormContext<PayStubType>();
  const formValues = watch();

  return <PayStubTemplate {...formValues} />;
}
