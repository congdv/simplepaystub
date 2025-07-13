'use client';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/constants';
import { LogoUpload } from '../ui/logo-upload';

export default function BusinessInfoForm() {
  const form = useFormContext();
  const logoUrl = form.watch('payer.logo');

  return (
    <div className="space-y-4 max-w-3xl mx-auto py-4">
      <div className="mb-4">
        <LogoUpload value={logoUrl} onChange={(val) => form.setValue('payer.logo', val)} />
      </div>

      <FormField
        control={form.control}
        name="payer.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:text-red-500">Company name</FormLabel>
            <FormControl>
              <Input placeholder="Acme Corporation" type="text" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <FormField
            control={form.control}
            name="payer.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="123 Business Avenue" />
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
            name="payer.addressSecond"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apt/Suite No.</FormLabel>
                <FormControl>
                  <Input placeholder="Suite 200" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payer.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" type="text" {...field} />
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
            name="payer.stateOrProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  State/Province
                </FormLabel>
                <FormControl>
                  <Input placeholder="NY" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payer.zipOrPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  Zip/Postal code
                </FormLabel>
                <FormControl>
                  <Input placeholder="10001" type="text" {...field} />
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
            name="payer.countryOrRegion"
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
                        <SelectValue placeholder="Select country" />
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
            name="payer.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:text-red-500">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="payer.extNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extension No.</FormLabel>
                <FormControl>
                  <Input placeholder="101" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <FormField
            control={form.control}
            name="payer.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="hr@company.com" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
