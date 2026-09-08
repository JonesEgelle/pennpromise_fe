"use client";

import { Toaster as SonnerToaster } from "sonner";

import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * App-wide toast surface. Mounted once in the root providers. Drive it from
 * mutation `onSuccess` / `onError` handlers — never call `toast` ad hoc from a
 * component when a mutation already owns the outcome.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-md border border-border bg-surface text-foreground",
        },
      }}
    />
  );
}
