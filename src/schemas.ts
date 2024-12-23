import { z } from "zod";

const fieldValidators = {
  minString: (message: string) => z.string().min(1, message)
};

const DynamicFieldSchema = z.object({
  label: z.string(),
  value: z.string(),
  ytd: z.string()
});

const PayerSchema = z.object({
  name: fieldValidators.minString("Company name is required"),
  address: fieldValidators.minString("Address is required"),
  addressSecond: z.string().optional(),
  city: fieldValidators.minString("City is required"),
  province: fieldValidators.minString("Province is required"),
  postalCode: fieldValidators.minString("Postal code is required"),
  phoneNumber: fieldValidators.minString("Company phone number is required"),
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
  phoneNumber: fieldValidators.minString("Employee phone number is required"),
  extNo: z.string().optional(),
  email: z.string().optional()
});

const PaymentSchema = z
  .object({
    name: z.string(),
    frequency: z.string(),
    type: z.string(),
    hourlyRate: z.string().optional(),
    numOfHours: z.string().optional(),
    annualSalary: z.string().optional(),
    date: z.coerce.date(),
    periodStart: z.coerce.date().optional(),
    periodEnd: z.coerce.date().optional(),
    chequeNumber: z.string().optional(),
    ytd: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.type === "Hourly" && !data.numOfHours) {
        return false;
      }
      return true;
    },
    {
      message: "Number of hours is required",
      path: ["numOfHours"]
    }
  )
  .refine(
    (data) => {
      if (data.type === "Hourly" && !data.hourlyRate) {
        return false;
      }
      return true;
    },
    {
      message: "Hourly rate is required",
      path: ["hourlyRate"]
    }
  )
  .refine(
    (data) => {
      if (data.type === "Salary" && !data.hourlyRate) {
        return false;
      }
      return true;
    },
    {
      message: "Annual salary is required",
      path: ["annualSalary"]
    }
  );

export const PayStubSchema = z
  .object({
    payer: PayerSchema,
    payee: PayeeSchema,
    payment: PaymentSchema,
    deductions: z.array(DynamicFieldSchema),
    benefits: z.array(DynamicFieldSchema)
  })
  .refine(
    (data) => {
      if (data.deductions) {
        const fields = new Set(
          data.deductions.map((deduction) => deduction.label)
        );
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
        message: "This deduction is already existed",
        path: ["deductions", pathIndex, "label"]
      };
    }
  )
  .refine(
    (data) => {
      if (data.benefits) {
        const fields = new Set(
          data.benefits.map((benefit) => benefit.label)
        );
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
          data.benefits.findIndex(
            (benefit) => benefit.label === data.benefits[right].label
          ) !== right
        ) {
          pathIndex = right;
        }
      }
      return {
        message: "This benefit is already existed",
        path: ["benefits", pathIndex, "label"]
      };
    }
  );
