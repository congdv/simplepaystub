export type FilingStatus = 'single' | 'married' | 'head_of_household';

export interface Bracket {
  min: number;
  rate: number;
}

export function applyBrackets(taxableIncome: number, brackets: Bracket[]): number {
  if (taxableIncome <= 0 || brackets.length === 0) return 0;
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const { min, rate } = brackets[i];
    if (taxableIncome <= min) break;
    const max = i + 1 < brackets.length ? brackets[i + 1].min : Infinity;
    tax += (Math.min(taxableIncome, max) - min) * rate;
  }
  return tax;
}
