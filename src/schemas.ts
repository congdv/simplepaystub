import { z } from 'zod';

const fieldValidators = {
  minString: (message: string) => z.string().min(1, message),
  nonNegativeString: (field: string) =>
    z.string().refine((val) => Number(val) >= 0, {
      message: `${field} must be a non-negative number`,
    }),
};

const DynamicFieldSchema = z
  .object({
    label: z.string(),
    value: fieldValidators.nonNegativeString('Value'),
    ytd: fieldValidators.nonNegativeString('YTD'),
  })
  .refine(
    (data) => {
      // Skip validation if either value is empty
      if (!data.value || !data.ytd) {
        return true;
      }

      const value = Number(data.value);
      const ytd = Number(data.ytd);
      return ytd >= value;
    },
    {
      message: 'Year-to-date amount must be greater than or equal to current period amount',
      path: ['ytd'],
    }
  );

const PayerSchema = z.object({
  logo: z.string().optional(),
  name: fieldValidators.minString('Company name is required'),
  address: fieldValidators.minString('Street Address is required'),
  addressSecond: z.string().optional(),
  city: fieldValidators.minString('City is required'),
  stateOrProvince: fieldValidators.minString('State/Province is required'),
  countryOrRegion: fieldValidators.minString('Country/region is required'),
  zipOrPostalCode: fieldValidators.minString('Zip/Postal code is required'),
  phoneNumber: fieldValidators.minString('Phone Number is required'),
  extNo: z.string().optional(),
  email: z.string().optional(),
});

const PayeeSchema = z.object({
  name: fieldValidators.minString('Full name is required'),
  address: fieldValidators.minString('Street Address is required'),
  addressSecond: z.string().optional(),
  city: fieldValidators.minString('City is required'),
  stateOrProvince: fieldValidators.minString('State/Province is required'),
  countryOrRegion: fieldValidators.minString('Country/region is required'),
  zipOrPostalCode: fieldValidators.minString('Zip/Postal code is required'),
  phoneNumber: z.string().optional(),
  extNo: z.string().optional(),
  email: z.string().optional(),
  filingStatus: z.enum(['single', 'married', 'head_of_household']).catch('single'),
});

const PaymentSchema = z
  .object({
    name: z.string(),
    frequency: z.string(),
    type: z.string(),
    hourlyRate: fieldValidators.nonNegativeString('Rate'),
    numOfHours: fieldValidators.nonNegativeString('Hours Worked'),
    annualSalary: fieldValidators.nonNegativeString('Annual salary'),
    date: z.coerce.date(),
    periodStart: z.coerce.date().optional(),
    periodEnd: z.coerce.date().optional(),
    chequeNumber: z.string().optional(),
    ytd: fieldValidators.nonNegativeString('Year-to-date Gross Pay'),
  })
  .refine(
    (data) => {
      if (data.type === 'Hourly' && !data.numOfHours) {
        return false;
      }
      return true;
    },
    {
      message: 'Hours Worked is required',
      path: ['numOfHours'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'Hourly' && !data.hourlyRate) {
        return false;
      }
      return true;
    },
    {
      message: 'Rate is required',
      path: ['hourlyRate'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'Salary' && !data.annualSalary) {
        return false;
      }
      return true;
    },
    {
      message: 'Annual salary is required',
      path: ['annualSalary'],
    }
  );

export const PayStubSchema = z
  .object({
    payer: PayerSchema,
    payee: PayeeSchema,
    payment: PaymentSchema,
    deductions: z.array(DynamicFieldSchema),
    benefits: z.array(DynamicFieldSchema),
    // optional template selector: defaults handled in UI
    template: z.enum(['NOVA', 'MONO']).optional(),
  })
  .refine(
    (data) => {
      if (data.deductions) {
        const fields = new Set(data.deductions.map((deduction) => deduction.label));
        if (fields.size !== data.deductions.length) {
          return false;
        }
      }
      return true;
    },
    (data) => {
      let pathIndex = -1;
      for (let right = data.deductions.length - 1; right >= 0; right--) {
        if (
          data.deductions.findIndex(
            (deduction) => deduction.label === data.deductions[right].label
          ) !== right
        ) {
          pathIndex = right;
        }
      }
      return {
        message: 'This deduction is already existed',
        path: ['deductions', pathIndex, 'label'],
      };
    }
  )
  .refine(
    (data) => {
      if (data.benefits) {
        const fields = new Set(data.benefits.map((benefit) => benefit.label));
        if (fields.size !== data.benefits.length) {
          return false;
        }
      }
      return true;
    },
    (data) => {
      let pathIndex = -1;
      for (let right = data.benefits.length - 1; right >= 0; right--) {
        if (
          data.benefits.findIndex((benefit) => benefit.label === data.benefits[right].label) !==
          right
        ) {
          pathIndex = right;
        }
      }
      return {
        message: 'This benefit is already existed',
        path: ['benefits', pathIndex, 'label'],
      };
    }
  );
