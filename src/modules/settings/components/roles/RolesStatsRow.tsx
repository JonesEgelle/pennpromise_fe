"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRolesStats } from "@/modules/settings/controllers/settingsController";

export function RolesStatsRow() {
  const { data, isLoading } = useRolesStats();

  if (isLoading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (!data) return null;

  const tiles = [
    {
      label: "Total Sharia Roles",
      value: String(data.totalRoles),
      sub: "Ethical hierarchy",
      valueClass: "text-foreground",
    },
    {
      label: "Ethical Permissions",
      value: String(data.ethicalPermissions),
      sub: "Halal endpoints",
      valueClass: "text-foreground",
    },
    {
      label: "Sharia MFA Enforced",
      value: String(data.mfaEnforced),
      sub: "Critical assets",
      valueClass: "text-destructive",
    },
    {
      label: "Sharia Audit Frequency",
      value: data.auditFrequency,
      sub: "Active",
      valueClass: "text-foreground",
      liveDot: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label} className="rounded-[15px] p-4 shadow-none">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {tile.label}
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className={cn("text-xl font-bold", tile.valueClass)}>
              {tile.value}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {tile.liveDot ? (
                <span
                  className="size-1.5 rounded-full bg-success animate-pulse"
                  aria-hidden
                />
              ) : null}
              {tile.sub}
            </span>
          </p>
        </Card>
      ))}
    </div>
  );
}
