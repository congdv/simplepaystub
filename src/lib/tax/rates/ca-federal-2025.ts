import { Bracket } from '../brackets';

export const CA_FEDERAL_2025 = {
  cppRate: 0.0595,
  cppBasicExemptionAnnual: 3_500,
  qppRate: 0.0540,
  eiStandardRate: 0.0166,
  eiQuebecRate: 0.0132,
  qpipRate: 0.00494,
  federalBasicPersonalAmount: 16_129,
  quebecFederalAbatement: 0.165,
};

// Canadian federal income tax brackets (2025)
export const CA_FEDERAL_BRACKETS_2025: Bracket[] = [
  { min: 0, rate: 0.15 },
  { min: 57_375, rate: 0.205 },
  { min: 114_750, rate: 0.26 },
  { min: 158_519, rate: 0.29 },
  { min: 220_000, rate: 0.33 },
];
