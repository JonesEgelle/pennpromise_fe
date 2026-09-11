"use client";

import type { ComponentType } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartLineIcon,
  MoneyIcon,
  PhoneCallIcon,
  ShieldSplitIcon,
  ShieldTickIcon,
} from "@/components/icons/status-icons";
import { cn } from "@/lib/utils";
import type { Role } from "@/modules/settings/types";

const ROLE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  "zonal-admin-north": ShieldTickIcon,
  "customer-relations-halal": PhoneCallIcon,
  "sharia-compliance-auditor": ShieldSplitIcon,
  "sukuk-forex-manager": MoneyIcon,
  "hal-market-analyst": ChartLineIcon,
};

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
    <Card className="h-full overflow-hidden rounded-[15px] shadow-none">
      <div className="border-b border-border bg-surface-muted px-5 py-4">
        <h3 className="text-base font-semibold text-foreground">
          Current Roles
        </h3>
      </div>

      <div className="divide-y divide-border">
        {isLoading && !roles ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-3">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))
        ) : !roles || roles.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No roles defined.</p>
        ) : (
          roles.map((role) => {
            const selected = role.id === selectedId;
            const Icon = ROLE_ICON[role.id] ?? ShieldTickIcon;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelect(role.id)}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 border-l-4 p-4 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  selected
                    ? "border-l-primary bg-primary/5"
                    : "border-l-transparent hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    selected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {role.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {role.description}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </Card>
  );
}
