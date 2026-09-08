"use client";

import * as React from "react";

import { QueryClientProvider } from "@/components/providers/QueryClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
