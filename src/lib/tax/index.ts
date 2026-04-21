import { TaxRow, calculateFICA } from './us';
import { calculateCPP, calculateEI } from './ca';
import { DEFAULT_YEAR, RatesYear } from './rates';

export type { TaxRow };
export type AutoTaxUnsupportedReason = 'unsupported_country' | 'unsupported_province';

export interface AutoTaxResult {
  rows: TaxRow[];
  unsupportedReason?: AutoTaxUnsupportedReason;
}

export function calculateAutoTax({
  country,
  province,
  gross,
  frequency,
  year = DEFAULT_YEAR,
}: {
  country: string;
  province: string;
  gross: number;
  frequency: string;
  year?: RatesYear;
}): AutoTaxResult {
  if (country === 'United States') {
    return { rows: calculateFICA(gross, year) };
  }
  if (country === 'Canada') {
    if (province === 'Quebec') {
      return { rows: [], unsupportedReason: 'unsupported_province' };
    }
    return { rows: [calculateCPP(gross, frequency, year), calculateEI(gross, year)] };
  }
  return { rows: [], unsupportedReason: 'unsupported_country' };
}
