'use client';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircleIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MoneyInput } from '../ui/money-input';

export default function BenefitsInfoForm() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  return (
    <>
      <div className="space-y-4 max-w-3xl mx-auto py-4">
        {fields.map((field, index) => {
          return (
            <div className="grid grid-cols-[1fr_1fr_auto] sm:grid-cols-12 gap-2" key={field.id}>
              <div className="col-span-3 sm:col-span-4">
                <FormField
                  control={control}
                  name={`benefits[${index}].label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefit name</FormLabel>
                      <FormControl>
                        <Input placeholder="Heath Insurance" type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 sm:col-span-3">
                <FormField
                  control={control}
                  name={`benefits[${index}].value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Pay</FormLabel>
                      <MoneyInput {...field} placeholder="150.00" />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 sm:col-span-4">
                <FormField
                  control={control}
                  name={`benefits[${index}].ytd`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year-to-date Total</FormLabel>
                      <MoneyInput {...field} placeholder="1,800.00" />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 sm:col-span-1">
                <div className="flex flex-col h-full justify-end">
                  <Button
                    className="text-red-400 hover:text-red-500"
                    variant={'ghost'}
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        variant={'ghost'}
        onClick={(event) => {
          event.preventDefault();
          append({ label: '', value: '', ytd: '' });
        }}
      >
        <PlusCircleIcon />
        Add new benefit
      </Button>
    </>
  );
}
