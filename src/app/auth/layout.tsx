import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Sign in — PennPromise Admin",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="bg-sidebar-gradient hidden flex-col justify-between p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            PP
          </span>
          <span className="text-lg font-semibold">PennPromise Capital</span>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold leading-snug">
            Sharia-compliant fintech operations, under one console.
          </h2>
          <p className="max-w-sm text-sm text-sidebar-foreground/80">
            KYC decisioning, transaction oversight, reconciliation and
            compliance monitoring for the PennPromise team.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/70">
          Internal use only · Nigeria
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        {children}
      </div>
    </div>
  );
}
