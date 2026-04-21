import { applyBrackets, FilingStatus } from './brackets';
import {
  US_FICA_2025,
  US_FEDERAL_BRACKETS_2025,
  US_FEDERAL_STANDARD_DEDUCTION_2025,
} from './rates/us-federal-2025';
import {
  getStateTaxConfig,
  getStateBrackets,
  getStateStandardDeduction,
} from './rates/us-states-2025';

export interface TaxRow {
  label: string;
  value: string;
  ytd: string;
}

function row(label: string, amount: number): TaxRow {
  return { label, value: amount.toFixed(2), ytd: '' };
}

export function calculateFICA(annualGross: number, periods: number): TaxRow[] {
  const r = US_FICA_2025;
  const perPeriodGross = annualGross / periods;
  const rows: TaxRow[] = [
    row('Social Security', perPeriodGross * r.socialSecurityRate),
    row('Medicare', perPeriodGross * r.medicareRate),
  ];
  // Additional Medicare: applied to per-period gross when the per-paycheck amount
  // exceeds the $200k threshold (IRS requires per-paycheck withholding above $200k)
  if (perPeriodGross > r.additionalMedicareThreshold) {
    rows.push(row(
      'Additional Medicare',
      (perPeriodGross - r.additionalMedicareThreshold) * r.additionalMedicareRate,
    ));
  }
  return rows;
}

export function calculateUSFederalIncomeTax(
  annualGross: number,
  periods: number,
  filingStatus: FilingStatus,
): TaxRow[] {
  const stdDed = US_FEDERAL_STANDARD_DEDUCTION_2025[filingStatus];
  const taxable = Math.max(0, annualGross - stdDed);
  const annualTax = applyBrackets(taxable, US_FEDERAL_BRACKETS_2025[filingStatus]);
  if (annualTax <= 0) return [];
  return [row('Federal Income Tax', annualTax / periods)];
}

export function calculateUSStateIncomeTax(
  annualGross: number,
  periods: number,
  stateAbbr: string,
  filingStatus: FilingStatus,
): TaxRow[] {
  const config = getStateTaxConfig(stateAbbr);
  if (!config) return [];
  const brackets = getStateBrackets(config, filingStatus);
  if (brackets.length === 0) return [];
  const stdDed = getStateStandardDeduction(config, filingStatus);
  const taxable = Math.max(0, annualGross - stdDed);
  const annualTax = applyBrackets(taxable, brackets);
  if (annualTax <= 0) return [];
  return [row('State Income Tax', annualTax / periods)];
}
