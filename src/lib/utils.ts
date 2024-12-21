import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function renderTemplate() {
  try {
    const myModule = await import(`@/components/templates/PayStubTemplate`);
    return myModule.default;
  } catch (error) {
    console.log(error)
  }
}

export const formatNumberWithCommas = (number: number = 0) => {
  return number.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });
};

export const formatCurrency = (number: number = 0) => {
  return `$${formatNumberWithCommas(number)}`
}