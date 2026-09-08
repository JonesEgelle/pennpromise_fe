"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarContent } from "@/components/shared/Sidebar";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The sidebar as a slide-in drawer for viewports below `md`. The design source
 * has no mobile frames — this is the agreed self-derived collapse (audit →
 * decision 2): same nav content, same tokens, in a <Sheet>.
 */
export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();

  // Close on navigation.
  React.useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showClose={false}
        className="bg-sidebar-gradient w-72 p-0"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          PennPromise admin console navigation
        </SheetDescription>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
