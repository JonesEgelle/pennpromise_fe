"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  /** Opens the mobile navigation drawer. Only rendered below `md`. */
  onMenuClick?: () => void;
}

/**
 * The slim top bar. The design source shows only a title and a bottom rule —
 * the account menu, theme control, and sign-out live in the sidebar profile
 * menu, not here.
 */
export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>
      <span className="text-sm font-semibold text-foreground">
        Administrative Portal
      </span>
    </header>
  );
}
