import { FilingStatus } from './brackets';
import { FREQUENCY_PERIODS } from './periods';
import {
  TaxRow,
  calculateFICA,
  calculateUSFederalIncomeTax,
  calculateUSStateIncomeTax,
} from './us';
import {
  calculateCPP,
  calculateQPP,
  calculateEIStandard,
  calculateEIQuebec,
  calculateQPIP,
  calculateCAFederalIncomeTax,
  calculateProvincialIncomeTax,
} from './ca';

export type { TaxRow };
export type { FilingStatus };
export type AutoTaxUnsupportedReason = 'unsupported_country';

export interface AutoTaxResult {
  rows: TaxRow[];
  unsupportedReason?: AutoTaxUnsupportedReason;
}

export const AUTO_TAX_LABELS = new Set([
  'Social Security',
  'Medicare',
  'Additional Medicare',
  'Federal Income Tax',
  'State Income Tax',
  'CPP',
  'QPP',
  'EI',
  'QPIP',
  'Provincial Income Tax',
]);

export { FREQUENCY_PERIODS };

export function calculateAutoTax({
  country,
  stateOrProvinceAbbr,
  annualGross,
  frequency,
  filingStatus,
}: {
  country: string;
  stateOrProvinceAbbr: string;
  annualGross: number;
  frequency: string;
  filingStatus: FilingStatus;
}): AutoTaxResult {
  const periods = FREQUENCY_PERIODS[frequency] ?? 26;

  if (country === 'United States') {
    return {
      rows: [
        ...calculateFICA(annualGross, periods),
        ...calculateUSFederalIncomeTax(annualGross, periods, filingStatus),
        ...calculateUSStateIncomeTax(annualGross, periods, stateOrProvinceAbbr, filingStatus),
      ],
    };
  }

  if (country === 'Canada') {
    const isQuebec = stateOrProvinceAbbr === 'QC';
    return {
      rows: [
        isQuebec
          ? calculateQPP(annualGross, frequency)
          : calculateCPP(annualGross, frequency),
        isQuebec
          ? calculateEIQuebec(annualGross, frequency)
          : calculateEIStandard(annualGross, frequency),
        ...(isQuebec ? [calculateQPIP(annualGross, frequency)] : []),
        ...calculateCAFederalIncomeTax(annualGross, periods, isQuebec),
        ...calculateProvincialIncomeTax(annualGross, periods, stateOrProvinceAbbr),
      ],
    };
  }

  return { rows: [], unsupportedReason: 'unsupported_country' };
}
