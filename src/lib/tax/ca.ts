import { RATES, DEFAULT_YEAR, RatesYear } from './rates';
import { TaxRow } from './us';

const FREQUENCY_PERIODS: Record<string, number> = {
  Daily: 260,
  Weekly: 52,
  'Bi-weekly': 26,
  'Semi-monthly': 24,
  Monthly: 12,
  Quarterly: 4,
  'Semi-annually': 2,
  Annually: 1,
};

export function calculateCPP(
  gross: number,
  frequency: string,
  year: RatesYear = DEFAULT_YEAR
): TaxRow {
  const r = RATES[year].ca;
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;
  const periodExemption = r.cppBasicExemptionAnnual / periods;
  const pensionable = Math.max(0, gross - periodExemption);
  return { label: 'CPP', value: (pensionable * r.cppRate).toFixed(2), ytd: '' };
}

export function calculateEI(gross: number, year: RatesYear = DEFAULT_YEAR): TaxRow {
  const r = RATES[year].ca;
  return { label: 'EI', value: (gross * r.eiRate).toFixed(2), ytd: '' };
}
