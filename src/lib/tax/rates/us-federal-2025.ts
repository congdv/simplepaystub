import { Bracket, FilingStatus } from '../brackets';

export const US_FICA_2025 = {
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: 200_000,
};

export const US_FEDERAL_STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15_000,
  married: 30_000,
  head_of_household: 22_500,
};

export const US_FEDERAL_BRACKETS_2025: Record<FilingStatus, Bracket[]> = {
  single: [
    { min: 0, rate: 0.10 },
    { min: 11_925, rate: 0.12 },
    { min: 48_475, rate: 0.22 },
    { min: 103_350, rate: 0.24 },
    { min: 197_300, rate: 0.32 },
    { min: 250_525, rate: 0.35 },
    { min: 626_350, rate: 0.37 },
  ],
  married: [
    { min: 0, rate: 0.10 },
    { min: 23_850, rate: 0.12 },
    { min: 96_950, rate: 0.22 },
    { min: 206_700, rate: 0.24 },
    { min: 394_600, rate: 0.32 },
    { min: 501_050, rate: 0.35 },
    { min: 751_600, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, rate: 0.10 },
    { min: 17_000, rate: 0.12 },
    { min: 64_850, rate: 0.22 },
    { min: 103_350, rate: 0.24 },
    { min: 197_300, rate: 0.32 },
    { min: 250_500, rate: 0.35 },
    { min: 626_350, rate: 0.37 },
  ],
};
