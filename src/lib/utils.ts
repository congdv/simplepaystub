import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { PayStubType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { isEqual } from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function renderTemplate() {
  try {
    const myModule = await import(`@/components/templates/PayStubTemplate`);
    return myModule.default;
  } catch (error) {
    console.log(error);
  }
}

export const formatNumberWithCommas = (number: number = 0) => {
  return number.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatCurrency = (number: number = 0) => {
  return `$${formatNumberWithCommas(number)}`;
};


export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A';

  try {
    return format(new Date(date), 'MMM d, yyyy'); // "Jan 15, 2024"
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const getTimeAgo = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'Unknown';
  }
};

export const isFormDataDefault = (formData: PayStubType): boolean => {
  return isEqual(formData, PAY_STUB_FORM_DEFAULT_VALUES);
};

export function getInitial(email?: string | null): string {
  if (!email || typeof email !== 'string' || email.length === 0) return '';
  return email.trim()[0].toUpperCase();
}