import { applyBrackets } from './brackets';
import { TaxRow } from './us';
import { FREQUENCY_PERIODS } from './periods';
import { CA_FEDERAL_2025, CA_FEDERAL_BRACKETS_2025 } from './rates/ca-federal-2025';
import { getProvinceTaxConfig } from './rates/ca-provinces-2025';

function row(label: string, amount: number): TaxRow {
  return { label, value: amount.toFixed(2), ytd: '' };
}

export function calculateCPP(annualGross: number, frequency: string): TaxRow {
  const r = CA_FEDERAL_2025;
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;
  const perPeriodGross = annualGross / periods;
  const periodExemption = r.cppBasicExemptionAnnual / periods;
  return row('CPP', Math.max(0, perPeriodGross - periodExemption) * r.cppRate);
}

export function calculateQPP(annualGross: number, frequency: string): TaxRow {
  const r = CA_FEDERAL_2025;
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;
  const perPeriodGross = annualGross / periods;
  const periodExemption = r.cppBasicExemptionAnnual / periods;
  return row('QPP', Math.max(0, perPeriodGross - periodExemption) * r.qppRate);
}

export function calculateEIStandard(annualGross: number, frequency: string): TaxRow {
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;
  return row('EI', (annualGross / periods) * CA_FEDERAL_2025.eiStandardRate);
}

export function calculateEIQuebec(annualGross: number, frequency: string): TaxRow {
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;
  return row('EI', (annualGross / periods) * CA_FEDERAL_2025.eiQuebecRate);
}

export function calculateQPIP(annualGross: number, frequency: string): TaxRow {
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;
  return row('QPIP', (annualGross / periods) * CA_FEDERAL_2025.qpipRate);
}

export function calculateCAFederalIncomeTax(
  annualGross: number,
  periods: number,
  isQuebec: boolean,
): TaxRow[] {
  const r = CA_FEDERAL_2025;
  const taxable = Math.max(0, annualGross - r.federalBasicPersonalAmount);
  let annualTax = applyBrackets(taxable, CA_FEDERAL_BRACKETS_2025);
  if (isQuebec) annualTax *= (1 - r.quebecFederalAbatement);
  if (annualTax <= 0) return [];
  return [row('Federal Income Tax', annualTax / periods)];
}

export function calculateProvincialIncomeTax(
  annualGross: number,
  periods: number,
  provinceAbbr: string,
): TaxRow[] {
  const config = getProvinceTaxConfig(provinceAbbr);
  if (!config) return [];
  const taxable = Math.max(0, annualGross - config.basicPersonalAmount);
  const annualTax = applyBrackets(taxable, config.brackets);
  if (annualTax <= 0) return [];
  return [row('Provincial Income Tax', annualTax / periods)];
}
