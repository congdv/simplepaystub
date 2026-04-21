import { Bracket } from '../brackets';

export interface ProvinceTaxConfig {
  brackets: Bracket[];
  basicPersonalAmount: number;
}

export const CA_PROVINCE_INCOME_2025: Record<string, ProvinceTaxConfig> = {
  AB: {
    brackets: [
      { min: 0, rate: 0.10 },
      { min: 148_269, rate: 0.12 },
      { min: 177_922, rate: 0.13 },
      { min: 237_230, rate: 0.14 },
      { min: 355_845, rate: 0.15 },
    ],
    basicPersonalAmount: 21_780,
  },
  BC: {
    brackets: [
      { min: 0, rate: 0.0506 },
      { min: 45_654, rate: 0.077 },
      { min: 91_310, rate: 0.105 },
      { min: 104_835, rate: 0.1229 },
      { min: 127_299, rate: 0.147 },
      { min: 172_602, rate: 0.168 },
      { min: 240_716, rate: 0.205 },
    ],
    basicPersonalAmount: 11_981,
  },
  MB: {
    brackets: [
      { min: 0, rate: 0.108 },
      { min: 47_000, rate: 0.1275 },
      { min: 100_000, rate: 0.174 },
    ],
    basicPersonalAmount: 15_780,
  },
  NB: {
    brackets: [
      { min: 0, rate: 0.094 },
      { min: 49_958, rate: 0.1482 },
      { min: 99_916, rate: 0.1652 },
      { min: 185_064, rate: 0.195 },
    ],
    basicPersonalAmount: 12_458,
  },
  NL: {
    brackets: [
      { min: 0, rate: 0.087 },
      { min: 43_198, rate: 0.145 },
      { min: 86_395, rate: 0.158 },
      { min: 154_244, rate: 0.178 },
      { min: 215_943, rate: 0.198 },
      { min: 275_870, rate: 0.208 },
      { min: 551_739, rate: 0.213 },
    ],
    basicPersonalAmount: 10_818,
  },
  NS: {
    brackets: [
      { min: 0, rate: 0.0879 },
      { min: 29_590, rate: 0.1495 },
      { min: 59_180, rate: 0.1667 },
      { min: 93_000, rate: 0.175 },
      { min: 150_000, rate: 0.21 },
    ],
    basicPersonalAmount: 8_481,
  },
  NT: {
    brackets: [
      { min: 0, rate: 0.059 },
      { min: 48_326, rate: 0.086 },
      { min: 96_655, rate: 0.122 },
      { min: 157_139, rate: 0.1405 },
    ],
    basicPersonalAmount: 16_593,
  },
  NU: {
    brackets: [
      { min: 0, rate: 0.04 },
      { min: 53_268, rate: 0.07 },
      { min: 106_537, rate: 0.09 },
      { min: 173_205, rate: 0.115 },
    ],
    basicPersonalAmount: 17_925,
  },
  ON: {
    brackets: [
      { min: 0, rate: 0.0505 },
      { min: 51_446, rate: 0.0915 },
      { min: 102_894, rate: 0.1116 },
      { min: 150_000, rate: 0.1216 },
      { min: 220_000, rate: 0.1316 },
    ],
    basicPersonalAmount: 11_865,
  },
  PE: {
    brackets: [
      { min: 0, rate: 0.0965 },
      { min: 32_656, rate: 0.1363 },
      { min: 64_313, rate: 0.1665 },
      { min: 105_000, rate: 0.18 },
      { min: 140_000, rate: 0.1875 },
    ],
    basicPersonalAmount: 12_000,
  },
  QC: {
    brackets: [
      { min: 0, rate: 0.14 },
      { min: 51_780, rate: 0.19 },
      { min: 103_545, rate: 0.24 },
      { min: 126_000, rate: 0.2575 },
    ],
    basicPersonalAmount: 17_183,
  },
  SK: {
    brackets: [
      { min: 0, rate: 0.105 },
      { min: 49_720, rate: 0.125 },
      { min: 142_058, rate: 0.145 },
    ],
    basicPersonalAmount: 17_661,
  },
  YT: {
    brackets: [
      { min: 0, rate: 0.064 },
      { min: 57_375, rate: 0.09 },
      { min: 114_750, rate: 0.109 },
      { min: 158_519, rate: 0.128 },
      { min: 500_000, rate: 0.15 },
    ],
    basicPersonalAmount: 16_129,
  },
};

export function getProvinceTaxConfig(provinceAbbr: string): ProvinceTaxConfig | null {
  return CA_PROVINCE_INCOME_2025[provinceAbbr] ?? null;
}
