import { z } from "zod";

const fieldValidators = {
  minString: (message: string) => z.string().min(1, message),

}

const DynamicFieldSchema = z.object({
  label: z.string(),
  value:  z.string()
});

const PayerSchema = z.object({
  name: fieldValidators.minString("Company name is required"),
  address: fieldValidators.minString("Address is required"),
  addressSecond: z.string().optional(),
  city: fieldValidators.minString("City is required"),
  province: fieldValidators.minString("Province is required"),
  postalCode: fieldValidators.minString("Postal code is required"),
  phoneNumber: z.string().optional(),
  extNo: z.string().optional(),
  email: z.string().optional()
});

const PayeeSchema = z.object({
  name: fieldValidators.minString("Employee name is required"),
  address: fieldValidators.minString("Address is required"),
  addressSecond: z.string().optional(),
  city: fieldValidators.minString("City is required"),
  province: fieldValidators.minString("Province is required"),
  postalCode: fieldValidators.minString("Postal code is required"),
  phoneNumber: z.string().optional(),
  extNo: z.string().optional(),
  email: z.string().optional()
});

const PaymentSchema = z.object({
  name: z.string(),
  frequency: z.string(),
  type: z.string(),
  hourlyRate: z.string().optional(),
  numOfHours: z.string().optional(),
  annualSalary: z.string().optional(),
  date: z.coerce.date(),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  chequeNumber: z.string().optional()
});

export const PayStubSchema = z.object({
  payer: PayerSchema,
  payee: PayeeSchema,
  payment: PaymentSchema,
  deductions: z.array(DynamicFieldSchema),
  benefits: z.array(DynamicFieldSchema)
});
