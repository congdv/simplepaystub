// Mock data for PayStubSchema

export const mockPayStub = {
  payer: {
    name: "Acme Corp",
    address: "123 Main St",
    addressSecond: "Suite 400",
    city: "Metropolis",
    province: "ON",
    postalCode: "A1B 2C3",
    phoneNumber: "555-123-4567",
    extNo: "101",
    email: "hr@acmecorp.com",
  },
  payee: {
    name: "John Doe",
    address: "456 Elm St",
    addressSecond: "",
    city: "Smallville",
    province: "ON",
    postalCode: "B2C 3D4",
    phoneNumber: "555-987-6543",
    extNo: "",
    email: "john.doe@email.com",
  },
  payment: {
    name: "Regular Pay",
    frequency: "Bi-Weekly",
    type: "Hourly",
    hourlyRate: "30",
    numOfHours: "80",
    annualSalary: "",
    chequeNumber: "000123",
    periodStart: new Date("2024-06-01"),
    periodEnd: new Date("2024-06-15"),
    date: new Date("2024-06-16"),
    ytd: "24000",
  },
  benefits: [
    { label: "Health Insurance", value: "100", ytd: "600" },
    { label: "Travel Allowance", value: "50", ytd: "300" },
  ],
  deductions: [
    { label: "Federal Tax", value: "400", ytd: "2400" },
    { label: "CPP", value: "100", ytd: "600" },
    { label: "EI", value: "50", ytd: "300" },
  ],
};