import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forwardRef } from 'react';

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ placeholder = '0.00', ...props }, ref) => {
    return (
      <FormControl>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            ref={ref}
            placeholder={placeholder}
            type="number"
            step="0.01"
            min="0"
            className="pl-7"
            {...props}
          />
        </div>
      </FormControl>
    );
  }
);

MoneyInput.displayName = 'MoneyInput';

export { MoneyInput };
