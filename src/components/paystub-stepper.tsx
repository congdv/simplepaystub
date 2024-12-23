"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import BusinessInfoForm from "./sections/business-info-form";
import EmployeeInfoForm from "./sections/employee-info-form";
import PaymentSection from "./sections/payment-section";
import DeductionsInfoForm from "./sections/deductions-info-form";
import BenefitsInfoForm from "./sections/benefits-info-form";
import { useFormContext } from "react-hook-form";
import { PayStubType } from "@/types";
import { cn } from "@/lib/utils";

const steps = [
  {
    label: "1.Business info",
    value: "payer",
    component: BusinessInfoForm
  },
  {
    label: "2.Employee info",
    value: "payee",
    component: EmployeeInfoForm
  },
  {
    label: "3.Income info",
    value: "payment",
    component: PaymentSection
  },
  {
    label: "4.Benefits info",
    value: "benefits",
    component: BenefitsInfoForm
  },
  {
    label: "5.Deductions info",
    value: "deductions",
    component: DeductionsInfoForm
  }
];

export default function PaystubStepper() {
  const {
    formState: { errors }
  } = useFormContext<PayStubType>();
  console.log("🚀 ~ PaystubStepper ~ errors:", errors);

  const getVariant = (field: string) => {
    if (
      (field === "payer" && errors.payer) ||
      (field === "payee" && errors.payee) ||
      (field === "payment" && errors.payment) ||
      (field === "deductions" && errors.deductions) ||
      (field === "benefits" && errors.benefits)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Tabs defaultValue={steps[0].value} className="w-full">
        <TabsList className="w-full flex gap-2 h-full bg-background">
          {steps.map((step) => (
            <TabsTrigger
              value={step.value}
              key={step.value}
              className={cn(
                "w-32 whitespace-normal text-[#111827] border rounded-md text-sm  hover:bg-[#111827] hover:text-[#fff] data-[state=active]:text-[#fff] data-[state=active]:bg-[#111827]",
                getVariant(step.value) &&
                  "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              )}
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
