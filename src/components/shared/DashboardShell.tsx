"use client";

import * as React from "react";

import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { MobileNav } from "@/components/shared/MobileNav";
import { Sidebar } from "@/components/shared/Sidebar";

/**
 * The persistent authenticated-app chrome: sidebar + top header + scrollable
 * main. Composed once in app/(accounts)/layout.tsx. Owns the mobile-nav open
 * state that the header toggles and the drawer consumes.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <MobileNav open={navOpen} onOpenChange={setNavOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
