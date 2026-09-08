"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<"input">, "name" | "form"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

/**
 * RHF-context-aware text input. The standard building block for every form
 * field — don't drop a bare <Input> into a <Form>.
 */
export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Input {...field} {...inputProps} />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
