"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon, Trash2 } from "lucide-react";

export default function BenefitsInfoForm() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits"
  });

  return (
    <>
      <div className="space-y-8 max-w-3xl mx-auto py-10">
        {fields.map((field, index) => {
          return (
            <div className="grid grid-cols-12 gap-2" key={field.id}>
              <div className="col-span-4">
                <FormField
                  control={control}
                  name={`benefits[${index}].label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefit name</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={control}
                  name={`benefits[${index}].value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefit value</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={control}
                  name={`benefits[${index}].ytd`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year to Date Benefit</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <div className="flex flex-col h-full justify-end">
                  <Button
                    className="text-red-400 hover:text-red-500"
                    variant={"ghost"}
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        variant={"ghost"}
        onClick={(event) => {
          event.preventDefault();
          append({ label: "", value: "", ytd: ""});
        }}
      >
        <PlusCircleIcon />
        Add new benefit
      </Button>
    </>
  );
}
