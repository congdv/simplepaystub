// Update this file each year — single source of truth for payroll contribution rates
export const RATES = {
  2025: {
    us: {
      socialSecurity: 0.062,
      medicare: 0.0145,
      additionalMedicare: 0.009,
      additionalMedicareThreshold: 200_000,
    },
    ca: {
      cppRate: 0.0595,
      cppBasicExemptionAnnual: 3_500,
      eiRate: 0.0166,
    },
  },
} as const;

export type RatesYear = keyof typeof RATES;
export const DEFAULT_YEAR: RatesYear = 2025;
