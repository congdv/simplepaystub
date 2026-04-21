import { RATES, DEFAULT_YEAR, RatesYear } from './rates';

export interface TaxRow {
  label: string;
  value: string;
  ytd: string;
}

export function calculateFICA(gross: number, year: RatesYear = DEFAULT_YEAR): TaxRow[] {
  const r = RATES[year].us;
  const rows: TaxRow[] = [
    { label: 'Social Security', value: (gross * r.socialSecurity).toFixed(2), ytd: '' },
    { label: 'Medicare', value: (gross * r.medicare).toFixed(2), ytd: '' },
  ];
  if (gross > r.additionalMedicareThreshold) {
    rows.push({
      label: 'Additional Medicare',
      value: ((gross - r.additionalMedicareThreshold) * r.additionalMedicare).toFixed(2),
      ytd: '',
    });
  }
  return rows;
}
