import { PropsWithChildren } from "react";
import {
  FormProvider,
  UseFormProps,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tv } from "tailwind-variants";

import { z } from "zod";

import { createComponent, themeComponent } from ".";

export const Input = themeComponent(
  createComponent(
    "input",
    tv({ base: "block w-full p-3 disabled:opacity-50" })
  ),
  ["input"]
);
export const Label = themeComponent(
  createComponent(
    "label",
    tv({ base: "text-xs uppercase tracking-widest text-gray-600" })
  ),
  ["label"]
);

export const Select = themeComponent(
  createComponent(
    "select",
    tv({
      base: "w-full block p-2  border-r-8 border-transparent",
    })
  ),
  ["input"]
);

export interface FormProps<S extends z.ZodType<any, any>>
  extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  onSubmit: (values: z.infer<S>, form: UseFormReturn<any>) => void;
}

export function Form<S extends z.ZodType<any, any>>({
  defaultValues,
  schema,
  children,
  onSubmit,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({ defaultValues, resolver: zodResolver(schema) });
  // Pass the form methods to a FormProvider. This lets us access the form from components without passing props.
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values, form))}>
        {children}
      </form>
    </FormProvider>
  );
}
