export const PROVINCES = [
  { name: 'Alberta', abbreviation: 'AB' },
  { name: 'British Columbia', abbreviation: 'BC' },
  { name: 'Manitoba', abbreviation: 'MB' },
  { name: 'New Brunswick', abbreviation: 'NB' },
  { name: 'Newfoundland and Labrador', abbreviation: 'NL' },
  { name: 'Nova Scotia', abbreviation: 'NS' },
  { name: 'Ontario', abbreviation: 'ON' },
  { name: 'Prince Edward Island', abbreviation: 'PE' },
  { name: 'Quebec', abbreviation: 'QC' },
  { name: 'Saskatchewan', abbreviation: 'SK' },
  { name: 'Northwest Territories', abbreviation: 'NT' },
  { name: 'Nunavut', abbreviation: 'NU' },
  { name: 'Yukon', abbreviation: 'YT' },
];

export const DEFAULT_PAYMENT_FREQUENCY = 'Bi-weekly';
export const PAYMENT_FREQUENCIES = [
  'Daily',
  'Weekly',
  'Bi-weekly',
  'Semi-monthly',
  'Monthly',
  'Quarterly',
  'Semi-annually',
  'Annually',
];

export const DEFAULT_PAYMENT_TYPE = 'Hourly';
export const PAYMENT_TYPE = ['Hourly', 'Salary'];
const PAYER_DEFAULT_VALUES = {
  name: '',
  address: '',
  addressSecond: '',
  city: '',
  province: '',
  postalCode: '',
  phoneNumber: '',
  extNo: '',
  email: '',
};

const PAYEE_DEFAULT_VALUES = {
  name: '',
  address: '',
  addressSecond: '',
  city: '',
  province: '',
  postalCode: '',
  phoneNumber: '',
  extNo: '',
  email: '',
};

const PAYMENT_DEFAULT_VALUES = {
  name: 'Regular Salary',
  type: DEFAULT_PAYMENT_TYPE,
  hourlyRate: '',
  annualSalary: '',
  numOfHours: '',
  date: new Date(),
  periodStart: new Date(),
  periodEnd: new Date(),
  frequency: '',
  chequeNumber: '',
  ytd: '',
};

export const PAY_STUB_FORM_DEFAULT_VALUES = {
  payer: PAYER_DEFAULT_VALUES,
  payee: PAYEE_DEFAULT_VALUES,
  payment: PAYMENT_DEFAULT_VALUES,
  deductions: [],
  benefits: [],
};
