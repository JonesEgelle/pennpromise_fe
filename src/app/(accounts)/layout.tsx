import type { Metadata } from "next";
import * as React from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { SessionMonitor } from "@/components/auth/SessionMonitor";
import { DashboardShell } from "@/components/shared/DashboardShell";

export const metadata: Metadata = {
  title: "PennPromise Admin",
};

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SessionMonitor />
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
