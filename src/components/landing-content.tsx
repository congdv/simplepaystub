"use client";

import { PayStubType } from "@/types";
import PaystubStepper from "./paystub-stepper";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import PayStubTemplate from "./templates/PayStubTemplate";
import { Form } from "./ui/form";
import Toolbar from "./toolbar";
import { useState } from "react";

export const LandingContent = () => {
  const form = useFormContext<PayStubType>();
  const { watch } = useFormContext<PayStubType>();
  const formValues = watch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const onSubmit = async (data: PayStubType) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        throw new Error("Failed to generate paystub PDF.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pay-stub.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  const onInvalid = () => {
    toast.warning("Please review invalid fields!");
  };
  const onReset = () => {
    form.reset();
    setErrorMsg(null);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <div className="flex flex-col md:flex-row h-full pt-4 md:pt-16 mx-auto max-w-screen-xl w-full gap-4">
          <div className="w-full md:w-[40%]">
            <PaystubStepper />
          </div>
          <div className="w-full md:w-[60%] mt-0 md:mt-32 overflow-x-auto">
            <PayStubTemplate {...formValues} />
            {errorMsg && (
          <div className="w-full flex justify-center mt-2">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-sm max-w-md text-center">
              {errorMsg}
            </div>
          </div>
        )}

          </div>
        </div>
            <Toolbar onReset={onReset} isLoading={isLoading}/>

      </form>
    </Form>
  );
};