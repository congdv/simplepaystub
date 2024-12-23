"use client";
import { PAY_STUB_FORM_DEFAULT_VALUES } from "@/constants";
import { PayStubSchema } from "@/schemas";
import { PayStubType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

export default function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const form = useForm<PayStubType>({
    resolver: zodResolver(PayStubSchema),
    defaultValues: PAY_STUB_FORM_DEFAULT_VALUES,
    mode: "all"
  });
  return (
    <main className="h-full bg-[#fff] overflow-auto">
      <FormProvider {...form}>{children}</FormProvider>
    </main>
  );
}
