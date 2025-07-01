"use client";

import { PayStubType } from "@/types";
import PaystubStepper from "./paystub-stepper";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import PayStubTemplate from "./templates/PayStubTemplate";
import { Form } from "./ui/form";
import Toolbar from "./toolbar";

export const LandingContent = () => {
  const form = useFormContext<PayStubType>();
  const { watch } = useFormContext<PayStubType>();
  const formValues = watch();
  const onSubmit = (data: PayStubType) => {
    fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pay-stub`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };
  const onInvalid = () => {
    toast.warning("Please review invalid fields!");
  };
  const onReset = () => {
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <div className="flex flex-col md:flex-row h-full pt-4 md:pt-16 mx-auto max-w-screen-xl w-full gap-4">
          <div className="w-full md:w-[40%]">
            <PaystubStepper />
          </div>
          <div className="w-full md:w-[60%] mt-8 md:mt-32 overflow-x-auto">
            <PayStubTemplate {...formValues} />
          </div>
        </div>
        <Toolbar onReset={onReset} />
      </form>
    </Form>
  );
};