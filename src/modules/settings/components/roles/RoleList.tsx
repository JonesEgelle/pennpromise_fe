"use client";

import { ShieldCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Role } from "@/modules/settings/types";

interface RoleListProps {
  roles: Role[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RoleList({
  roles,
  isLoading,
  selectedId,
  onSelect,
}: RoleListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Current Roles</h3>
      <div className="space-y-2">
        {isLoading && !roles ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))
        ) : !roles || roles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No roles defined.</p>
        ) : (
          roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              aria-current={role.id === selectedId ? "true" : undefined}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border border-l-2 p-3 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                role.id === selectedId
                  ? "border-border border-l-primary bg-primary/5"
                  : "border-border border-l-transparent hover:bg-muted/40",
              )}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <ShieldCheck className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {role.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {role.description}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
