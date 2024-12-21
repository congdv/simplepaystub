"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import BusinessInfoForm from "./business-info-form";
import EmployeeInfoForm from "./employee-info-form";
import IncomeInfoForm from "./income-info-form";
import DeductionsInfoForm from "./deductions-info-form";
import BenefitsInfoForm from "./benefits-info-form";

const steps = [
  {
    label: "1.Business info",
    value: "business-info",
    component: BusinessInfoForm
  },
  {
    label: "2.Employee info",
    value: "employee-info",
    component: EmployeeInfoForm
  },
  {
    label: "3.Income info",
    value: "income-info",
    component: IncomeInfoForm
  },
  {
    label: "4.Benefits info",
    value: "benefits-info",
    component: BenefitsInfoForm
  },
  {
    label: "5.Deductions info",
    value: "deductions-info",
    component: DeductionsInfoForm
  }
];

export default function PaystubStepper() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Tabs defaultValue={steps[0].value} className="w-full">
        <TabsList className="w-full flex gap-2 h-full bg-background">
          {steps.map((step) => (
            <TabsTrigger
              value={step.value}
              key={step.value}
              className="w-32 whitespace-normal text-[#111827] border rounded-md text-sm  hover:bg-[#111827] hover:text-[#fff] data-[state=active]:text-[#fff] data-[state=active]:bg-[#111827]"
            >
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((step) => (
          <TabsContent value={step.value} key={step.value}>
            <step.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
