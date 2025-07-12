'use client';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  DEFAULT_PAYMENT_FREQUENCY,
  DEFAULT_PAYMENT_TYPE,
  PAYMENT_FREQUENCIES,
  PAYMENT_TYPE,
} from '@/constants';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PayStubType } from '@/types';
import { useState } from 'react';

export default function PaymentSection() {
  const form = useFormContext<PayStubType>();
  const [payDateOpen, setPayDateOpen] = useState(false);
  const [periodStartOpen, setPeriodStartOpen] = useState(false);
  const [periodEndOpen, setPeriodEndOpen] = useState(false);

  const formValues = form.watch();

  return (
    <Form {...form}>
      <div className="space-y-4 max-w-3xl mx-auto py-4">
        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="payment.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500">
                    How do you pay?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center"
                    >
                      {PAYMENT_TYPE.map((type) => (
                        <div className="flex items-center space-x-2" key={type}>
                          <RadioGroupItem value={type} id={type} />
                          <FormLabel htmlFor={type}>{type}</FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {formValues.payment.type === DEFAULT_PAYMENT_TYPE && (
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="payment.hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Hourly Rate
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" {...field} min={0} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="payment.numOfHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Number of hours
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" {...field} min={0} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        {formValues.payment.type !== DEFAULT_PAYMENT_TYPE && (
          <div className="grid grid-cols-12">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="payment.annualSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Annual Salary
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        {/* <div className="grid grid-cols-12">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="payment.frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500">
                    How often do you pay?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={DEFAULT_PAYMENT_FREQUENCY}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_FREQUENCIES.map((payment) => (
                        <SelectItem value={payment} key={payment}>
                          {payment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div> */}
        <FormField
          control={form.control}
          name="payment.date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="after:content-['*'] after:text-red-500">Pay date</FormLabel>
              <Popover open={payDateOpen} onOpenChange={setPayDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[200px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setPayDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="payment.periodStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="after:content-['*'] after:text-red-500">
                    Pay Period Start
                  </FormLabel>
                  <Popover open={periodStartOpen} onOpenChange={setPeriodStartOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[200px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setPeriodStartOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="payment.periodEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="after:content-['*'] after:text-red-500">
                    Pay Period End
                  </FormLabel>
                  <Popover open={periodEndOpen} onOpenChange={setPeriodEndOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[200px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setPeriodEndOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="payment.ytd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year to Date amount</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} min={0} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment.chequeNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cheque Number</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
