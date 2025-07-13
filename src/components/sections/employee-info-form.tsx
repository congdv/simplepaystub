'use client';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { COUNTRIES } from '@/constants';

export default function EmployeeInfoForm() {
  const form = useFormContext();

  return (
    <div className="space-y-4 max-w-3xl mx-auto py-4">
      <FormField
        control={form.control}
        name="payee.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:text-red-500">Full Name</FormLabel>
            <FormControl>
              <Input placeholder="" type="text" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="payee.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:text-red-500">Street Address</FormLabel>
            <FormControl>
              <Input placeholder="" type="text" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payee.addressSecond"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apt/Suite No.</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payee.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">City</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payee.stateOrProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  State/Province
                </FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payee.zipOrPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  Zip/Postal code
                </FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <FormField
            control={form.control}
            name="payee.countryOrRegion"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500">
                    Country/Region
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem value={c.name} key={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payee.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payee.extNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ext No.</FormLabel>
                <FormControl>
                  <Input placeholder="" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="payee.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input placeholder="" type="email" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
