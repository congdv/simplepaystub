import { Bracket, FilingStatus } from '../brackets';

export interface StateTaxConfig {
  brackets: { single: Bracket[]; married: Bracket[]; head_of_household?: Bracket[] };
  standardDeduction: { single: number; married: number; head_of_household?: number };
}

// Empty brackets = no state income tax
const NO_TAX: StateTaxConfig = {
  brackets: { single: [], married: [] },
  standardDeduction: { single: 0, married: 0 },
};

export const US_STATE_INCOME_2025: Record<string, StateTaxConfig> = {
  // ── No income tax ──────────────────────────────────────────────────────────
  AK: NO_TAX,
  FL: NO_TAX,
  NV: NO_TAX,
  NH: NO_TAX,
  SD: NO_TAX,
  TN: NO_TAX,
  TX: NO_TAX,
  WA: NO_TAX,
  WY: NO_TAX,

  // ── Flat or simplified ──────────────────────────────────────────────────────
  AZ: {
    brackets: { single: [{ min: 0, rate: 0.025 }], married: [{ min: 0, rate: 0.025 }] },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  AR: {
    brackets: { single: [{ min: 0, rate: 0.039 }], married: [{ min: 0, rate: 0.039 }] },
    standardDeduction: { single: 2_270, married: 4_540 },
  },
  CO: {
    brackets: { single: [{ min: 0, rate: 0.044 }], married: [{ min: 0, rate: 0.044 }] },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  GA: {
    brackets: { single: [{ min: 0, rate: 0.0539 }], married: [{ min: 0, rate: 0.0539 }] },
    standardDeduction: { single: 12_000, married: 24_000 },
  },
  ID: {
    brackets: { single: [{ min: 0, rate: 0.05695 }], married: [{ min: 0, rate: 0.05695 }] },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  IL: {
    brackets: { single: [{ min: 0, rate: 0.0495 }], married: [{ min: 0, rate: 0.0495 }] },
    standardDeduction: { single: 2_425, married: 4_850 },
  },
  IN: {
    brackets: { single: [{ min: 0, rate: 0.0305 }], married: [{ min: 0, rate: 0.0305 }] },
    standardDeduction: { single: 1_000, married: 2_000 },
  },
  IA: {
    brackets: { single: [{ min: 0, rate: 0.038 }], married: [{ min: 0, rate: 0.038 }] },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  KY: {
    brackets: { single: [{ min: 0, rate: 0.04 }], married: [{ min: 0, rate: 0.04 }] },
    standardDeduction: { single: 2_980, married: 5_960 },
  },
  MA: {
    brackets: { single: [{ min: 0, rate: 0.05 }], married: [{ min: 0, rate: 0.05 }] },
    standardDeduction: { single: 4_400, married: 8_800 },
  },
  MI: {
    brackets: { single: [{ min: 0, rate: 0.0425 }], married: [{ min: 0, rate: 0.0425 }] },
    standardDeduction: { single: 5_600, married: 11_200 },
  },
  NC: {
    brackets: { single: [{ min: 0, rate: 0.0425 }], married: [{ min: 0, rate: 0.0425 }] },
    standardDeduction: { single: 10_750, married: 21_500 },
  },
  PA: {
    brackets: { single: [{ min: 0, rate: 0.0307 }], married: [{ min: 0, rate: 0.0307 }] },
    standardDeduction: { single: 0, married: 0 },
  },
  UT: {
    brackets: { single: [{ min: 0, rate: 0.0455 }], married: [{ min: 0, rate: 0.0455 }] },
    standardDeduction: { single: 14_600, married: 29_200 },
  },

  // ── Progressive ─────────────────────────────────────────────────────────────
  AL: {
    brackets: {
      single: [
        { min: 0, rate: 0.02 },
        { min: 500, rate: 0.04 },
        { min: 3_000, rate: 0.05 },
      ],
      married: [
        { min: 0, rate: 0.02 },
        { min: 1_000, rate: 0.04 },
        { min: 6_000, rate: 0.05 },
      ],
    },
    standardDeduction: { single: 3_000, married: 8_500 },
  },
  CA: {
    brackets: {
      single: [
        { min: 0, rate: 0.01 },
        { min: 10_756, rate: 0.02 },
        { min: 25_499, rate: 0.04 },
        { min: 40_245, rate: 0.06 },
        { min: 55_866, rate: 0.08 },
        { min: 70_606, rate: 0.093 },
        { min: 360_659, rate: 0.103 },
        { min: 432_787, rate: 0.113 },
        { min: 721_314, rate: 0.123 },
        { min: 1_000_000, rate: 0.133 },
      ],
      married: [
        { min: 0, rate: 0.01 },
        { min: 21_512, rate: 0.02 },
        { min: 50_998, rate: 0.04 },
        { min: 80_490, rate: 0.06 },
        { min: 111_732, rate: 0.08 },
        { min: 141_212, rate: 0.093 },
        { min: 721_318, rate: 0.103 },
        { min: 865_574, rate: 0.113 },
        { min: 1_442_628, rate: 0.123 },
        { min: 1_000_000, rate: 0.133 },
      ],
      head_of_household: [
        { min: 0, rate: 0.01 },
        { min: 21_527, rate: 0.02 },
        { min: 51_066, rate: 0.04 },
        { min: 65_744, rate: 0.06 },
        { min: 81_364, rate: 0.08 },
        { min: 96_107, rate: 0.093 },
        { min: 490_493, rate: 0.103 },
        { min: 588_593, rate: 0.113 },
        { min: 721_314, rate: 0.123 },
        { min: 1_000_000, rate: 0.133 },
      ],
    },
    standardDeduction: { single: 5_202, married: 10_404, head_of_household: 10_726 },
  },
  CT: {
    brackets: {
      single: [
        { min: 0, rate: 0.02 },
        { min: 10_000, rate: 0.045 },
        { min: 50_000, rate: 0.055 },
        { min: 100_000, rate: 0.06 },
        { min: 200_000, rate: 0.065 },
        { min: 250_000, rate: 0.069 },
        { min: 500_000, rate: 0.0699 },
      ],
      married: [
        { min: 0, rate: 0.02 },
        { min: 20_000, rate: 0.045 },
        { min: 100_000, rate: 0.055 },
        { min: 200_000, rate: 0.06 },
        { min: 400_000, rate: 0.065 },
        { min: 500_000, rate: 0.069 },
        { min: 1_000_000, rate: 0.0699 },
      ],
    },
    standardDeduction: { single: 15_000, married: 24_000 },
  },
  DC: {
    brackets: {
      single: [
        { min: 0, rate: 0.04 },
        { min: 10_000, rate: 0.06 },
        { min: 40_000, rate: 0.065 },
        { min: 60_000, rate: 0.085 },
        { min: 350_000, rate: 0.0925 },
        { min: 1_000_000, rate: 0.1075 },
      ],
      married: [
        { min: 0, rate: 0.04 },
        { min: 10_000, rate: 0.06 },
        { min: 40_000, rate: 0.065 },
        { min: 60_000, rate: 0.085 },
        { min: 350_000, rate: 0.0925 },
        { min: 1_000_000, rate: 0.1075 },
      ],
    },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  DE: {
    brackets: {
      single: [
        { min: 0, rate: 0 },
        { min: 2_000, rate: 0.022 },
        { min: 5_000, rate: 0.039 },
        { min: 10_000, rate: 0.048 },
        { min: 20_000, rate: 0.052 },
        { min: 25_000, rate: 0.0555 },
        { min: 60_000, rate: 0.066 },
      ],
      married: [
        { min: 0, rate: 0 },
        { min: 2_000, rate: 0.022 },
        { min: 5_000, rate: 0.039 },
        { min: 10_000, rate: 0.048 },
        { min: 20_000, rate: 0.052 },
        { min: 25_000, rate: 0.0555 },
        { min: 60_000, rate: 0.066 },
      ],
    },
    standardDeduction: { single: 3_250, married: 6_500 },
  },
  HI: {
    brackets: {
      single: [
        { min: 0, rate: 0.014 },
        { min: 2_400, rate: 0.032 },
        { min: 4_800, rate: 0.055 },
        { min: 9_600, rate: 0.064 },
        { min: 14_400, rate: 0.068 },
        { min: 19_200, rate: 0.072 },
        { min: 24_000, rate: 0.076 },
        { min: 36_000, rate: 0.079 },
        { min: 48_000, rate: 0.0825 },
        { min: 150_000, rate: 0.09 },
        { min: 175_000, rate: 0.10 },
        { min: 200_000, rate: 0.11 },
      ],
      married: [
        { min: 0, rate: 0.014 },
        { min: 4_800, rate: 0.032 },
        { min: 9_600, rate: 0.055 },
        { min: 19_200, rate: 0.064 },
        { min: 28_800, rate: 0.068 },
        { min: 38_400, rate: 0.072 },
        { min: 48_000, rate: 0.076 },
        { min: 72_000, rate: 0.079 },
        { min: 96_000, rate: 0.0825 },
        { min: 300_000, rate: 0.09 },
        { min: 350_000, rate: 0.10 },
        { min: 400_000, rate: 0.11 },
      ],
    },
    standardDeduction: { single: 2_200, married: 4_400 },
  },
  KS: {
    brackets: {
      single: [
        { min: 0, rate: 0.031 },
        { min: 15_000, rate: 0.0525 },
        { min: 30_000, rate: 0.057 },
      ],
      married: [
        { min: 0, rate: 0.031 },
        { min: 30_000, rate: 0.0525 },
        { min: 60_000, rate: 0.057 },
      ],
    },
    standardDeduction: { single: 3_500, married: 8_000 },
  },
  LA: {
    brackets: {
      single: [
        { min: 0, rate: 0.0185 },
        { min: 12_500, rate: 0.035 },
        { min: 50_000, rate: 0.0425 },
      ],
      married: [
        { min: 0, rate: 0.0185 },
        { min: 25_000, rate: 0.035 },
        { min: 100_000, rate: 0.0425 },
      ],
    },
    standardDeduction: { single: 4_500, married: 9_000 },
  },
  ME: {
    brackets: {
      single: [
        { min: 0, rate: 0.058 },
        { min: 24_500, rate: 0.0675 },
        { min: 58_050, rate: 0.0715 },
      ],
      married: [
        { min: 0, rate: 0.058 },
        { min: 49_050, rate: 0.0675 },
        { min: 116_100, rate: 0.0715 },
      ],
    },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  MD: {
    brackets: {
      single: [
        { min: 0, rate: 0.02 },
        { min: 1_000, rate: 0.03 },
        { min: 2_000, rate: 0.04 },
        { min: 3_000, rate: 0.0475 },
        { min: 100_000, rate: 0.05 },
        { min: 125_000, rate: 0.0525 },
        { min: 150_000, rate: 0.055 },
        { min: 250_000, rate: 0.0575 },
      ],
      married: [
        { min: 0, rate: 0.02 },
        { min: 1_000, rate: 0.03 },
        { min: 2_000, rate: 0.04 },
        { min: 3_000, rate: 0.0475 },
        { min: 150_000, rate: 0.05 },
        { min: 175_000, rate: 0.0525 },
        { min: 225_000, rate: 0.055 },
        { min: 300_000, rate: 0.0575 },
      ],
    },
    standardDeduction: { single: 2_700, married: 5_450 },
  },
  MN: {
    brackets: {
      single: [
        { min: 0, rate: 0.0535 },
        { min: 31_690, rate: 0.068 },
        { min: 104_090, rate: 0.0785 },
        { min: 183_340, rate: 0.0985 },
      ],
      married: [
        { min: 0, rate: 0.0535 },
        { min: 46_330, rate: 0.068 },
        { min: 184_040, rate: 0.0785 },
        { min: 321_450, rate: 0.0985 },
      ],
    },
    standardDeduction: { single: 14_575, married: 29_150 },
  },
  MS: {
    brackets: {
      single: [
        { min: 0, rate: 0 },
        { min: 10_000, rate: 0.047 },
      ],
      married: [
        { min: 0, rate: 0 },
        { min: 10_000, rate: 0.047 },
      ],
    },
    standardDeduction: { single: 2_300, married: 4_600 },
  },
  MO: {
    brackets: {
      single: [
        { min: 0, rate: 0 },
        { min: 1_207, rate: 0.02 },
        { min: 2_414, rate: 0.025 },
        { min: 3_621, rate: 0.03 },
        { min: 4_828, rate: 0.035 },
        { min: 6_035, rate: 0.04 },
        { min: 7_242, rate: 0.045 },
        { min: 8_449, rate: 0.0495 },
      ],
      married: [
        { min: 0, rate: 0 },
        { min: 1_207, rate: 0.02 },
        { min: 2_414, rate: 0.025 },
        { min: 3_621, rate: 0.03 },
        { min: 4_828, rate: 0.035 },
        { min: 6_035, rate: 0.04 },
        { min: 7_242, rate: 0.045 },
        { min: 8_449, rate: 0.0495 },
      ],
    },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  MT: {
    brackets: {
      single: [
        { min: 0, rate: 0.047 },
        { min: 20_500, rate: 0.059 },
      ],
      married: [
        { min: 0, rate: 0.047 },
        { min: 21_200, rate: 0.059 },
      ],
    },
    standardDeduction: { single: 5_540, married: 11_080 },
  },
  NE: {
    brackets: {
      single: [
        { min: 0, rate: 0.0246 },
        { min: 3_700, rate: 0.0344 },
        { min: 22_170, rate: 0.0455 },
      ],
      married: [
        { min: 0, rate: 0.0246 },
        { min: 7_400, rate: 0.0344 },
        { min: 44_330, rate: 0.0455 },
      ],
    },
    standardDeduction: { single: 7_900, married: 15_800 },
  },
  NJ: {
    brackets: {
      single: [
        { min: 0, rate: 0.014 },
        { min: 20_000, rate: 0.0175 },
        { min: 35_000, rate: 0.0245 },
        { min: 40_000, rate: 0.035 },
        { min: 75_000, rate: 0.05525 },
        { min: 500_000, rate: 0.0637 },
        { min: 1_000_000, rate: 0.1075 },
      ],
      married: [
        { min: 0, rate: 0.014 },
        { min: 20_000, rate: 0.0175 },
        { min: 50_000, rate: 0.0245 },
        { min: 70_000, rate: 0.035 },
        { min: 80_000, rate: 0.05525 },
        { min: 150_000, rate: 0.0637 },
        { min: 500_000, rate: 0.0897 },
        { min: 1_000_000, rate: 0.1075 },
      ],
    },
    standardDeduction: { single: 1_000, married: 2_000 },
  },
  NM: {
    brackets: {
      single: [
        { min: 0, rate: 0.017 },
        { min: 5_500, rate: 0.032 },
        { min: 11_000, rate: 0.047 },
        { min: 16_000, rate: 0.049 },
        { min: 210_000, rate: 0.059 },
      ],
      married: [
        { min: 0, rate: 0.017 },
        { min: 8_000, rate: 0.032 },
        { min: 16_000, rate: 0.047 },
        { min: 24_000, rate: 0.049 },
        { min: 315_000, rate: 0.059 },
      ],
    },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  NY: {
    brackets: {
      single: [
        { min: 0, rate: 0.04 },
        { min: 8_500, rate: 0.045 },
        { min: 11_700, rate: 0.0525 },
        { min: 13_900, rate: 0.055 },
        { min: 21_400, rate: 0.06 },
        { min: 80_650, rate: 0.0685 },
        { min: 215_400, rate: 0.0965 },
        { min: 1_077_550, rate: 0.103 },
        { min: 25_000_000, rate: 0.109 },
      ],
      married: [
        { min: 0, rate: 0.04 },
        { min: 17_150, rate: 0.045 },
        { min: 23_600, rate: 0.0525 },
        { min: 27_900, rate: 0.055 },
        { min: 43_000, rate: 0.06 },
        { min: 161_550, rate: 0.0685 },
        { min: 323_200, rate: 0.0965 },
        { min: 2_155_350, rate: 0.103 },
        { min: 25_000_000, rate: 0.109 },
      ],
      head_of_household: [
        { min: 0, rate: 0.04 },
        { min: 12_800, rate: 0.045 },
        { min: 17_650, rate: 0.0525 },
        { min: 20_900, rate: 0.055 },
        { min: 32_200, rate: 0.06 },
        { min: 107_650, rate: 0.0685 },
        { min: 269_300, rate: 0.0965 },
        { min: 1_616_450, rate: 0.103 },
        { min: 25_000_000, rate: 0.109 },
      ],
    },
    standardDeduction: { single: 8_000, married: 16_050, head_of_household: 11_200 },
  },
  ND: {
    brackets: {
      single: [
        { min: 0, rate: 0.0195 },
        { min: 44_725, rate: 0.025 },
      ],
      married: [
        { min: 0, rate: 0.0195 },
        { min: 74_750, rate: 0.025 },
      ],
    },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  OH: {
    brackets: {
      single: [
        { min: 0, rate: 0 },
        { min: 26_050, rate: 0.0275 },
        { min: 100_000, rate: 0.035 },
      ],
      married: [
        { min: 0, rate: 0 },
        { min: 26_050, rate: 0.0275 },
        { min: 100_000, rate: 0.035 },
      ],
    },
    standardDeduction: { single: 2_400, married: 4_800 },
  },
  OK: {
    brackets: {
      single: [
        { min: 0, rate: 0 },
        { min: 1_000, rate: 0.0025 },
        { min: 2_500, rate: 0.0075 },
        { min: 3_750, rate: 0.0175 },
        { min: 4_900, rate: 0.0275 },
        { min: 7_200, rate: 0.0475 },
      ],
      married: [
        { min: 0, rate: 0 },
        { min: 2_000, rate: 0.0025 },
        { min: 5_000, rate: 0.0075 },
        { min: 7_500, rate: 0.0175 },
        { min: 9_800, rate: 0.0275 },
        { min: 12_200, rate: 0.0475 },
      ],
    },
    standardDeduction: { single: 6_300, married: 12_600 },
  },
  OR: {
    brackets: {
      single: [
        { min: 0, rate: 0.0475 },
        { min: 18_400, rate: 0.0675 },
        { min: 125_000, rate: 0.0875 },
        { min: 250_000, rate: 0.099 },
      ],
      married: [
        { min: 0, rate: 0.0475 },
        { min: 18_400, rate: 0.0675 },
        { min: 250_000, rate: 0.0875 },
        { min: 400_000, rate: 0.099 },
      ],
    },
    standardDeduction: { single: 2_745, married: 5_495 },
  },
  RI: {
    brackets: {
      single: [
        { min: 0, rate: 0.0375 },
        { min: 77_450, rate: 0.0475 },
        { min: 176_050, rate: 0.0599 },
      ],
      married: [
        { min: 0, rate: 0.0375 },
        { min: 77_450, rate: 0.0475 },
        { min: 176_050, rate: 0.0599 },
      ],
    },
    standardDeduction: { single: 9_700, married: 19_400 },
  },
  SC: {
    brackets: {
      single: [
        { min: 0, rate: 0 },
        { min: 3_460, rate: 0.03 },
        { min: 17_310, rate: 0.062 },
      ],
      married: [
        { min: 0, rate: 0 },
        { min: 3_460, rate: 0.03 },
        { min: 17_310, rate: 0.062 },
      ],
    },
    standardDeduction: { single: 13_850, married: 27_700 },
  },
  VT: {
    brackets: {
      single: [
        { min: 0, rate: 0.0335 },
        { min: 45_400, rate: 0.066 },
        { min: 110_050, rate: 0.076 },
        { min: 229_550, rate: 0.0875 },
      ],
      married: [
        { min: 0, rate: 0.0335 },
        { min: 75_850, rate: 0.066 },
        { min: 183_400, rate: 0.076 },
        { min: 279_450, rate: 0.0875 },
      ],
    },
    standardDeduction: { single: 6_500, married: 13_000 },
  },
  VA: {
    brackets: {
      single: [
        { min: 0, rate: 0.02 },
        { min: 3_000, rate: 0.03 },
        { min: 5_000, rate: 0.05 },
        { min: 17_000, rate: 0.0575 },
      ],
      married: [
        { min: 0, rate: 0.02 },
        { min: 3_000, rate: 0.03 },
        { min: 5_000, rate: 0.05 },
        { min: 17_000, rate: 0.0575 },
      ],
    },
    standardDeduction: { single: 8_000, married: 16_000 },
  },
  WV: {
    brackets: {
      single: [
        { min: 0, rate: 0.0236 },
        { min: 10_000, rate: 0.0315 },
        { min: 25_000, rate: 0.0354 },
        { min: 40_000, rate: 0.0472 },
        { min: 60_000, rate: 0.0512 },
      ],
      married: [
        { min: 0, rate: 0.0236 },
        { min: 10_000, rate: 0.0315 },
        { min: 25_000, rate: 0.0354 },
        { min: 40_000, rate: 0.0472 },
        { min: 60_000, rate: 0.0512 },
      ],
    },
    standardDeduction: { single: 14_600, married: 29_200 },
  },
  WI: {
    brackets: {
      single: [
        { min: 0, rate: 0.035 },
        { min: 14_320, rate: 0.044 },
        { min: 28_640, rate: 0.053 },
        { min: 315_000, rate: 0.0765 },
      ],
      married: [
        { min: 0, rate: 0.035 },
        { min: 19_090, rate: 0.044 },
        { min: 38_190, rate: 0.053 },
        { min: 420_420, rate: 0.0765 },
      ],
    },
    standardDeduction: { single: 11_940, married: 22_100 },
  },
};

export function getStateTaxConfig(stateAbbr: string): StateTaxConfig | null {
  return US_STATE_INCOME_2025[stateAbbr] ?? null;
}

export function getStateBrackets(config: StateTaxConfig, status: FilingStatus): Bracket[] {
  return config.brackets[status] ?? config.brackets.single;
}

export function getStateStandardDeduction(config: StateTaxConfig, status: FilingStatus): number {
  return config.standardDeduction[status] ?? config.standardDeduction.single;
}
