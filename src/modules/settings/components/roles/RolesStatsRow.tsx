"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    { label: "Total Sharia Roles", value: String(data.totalRoles), sub: "Ethical hierarchy" },
    { label: "Ethical Permissions", value: String(data.ethicalPermissions), sub: "Halal endpoints" },
    { label: "Sharia MFA Enforced", value: String(data.mfaEnforced), sub: "Critical assets" },
    { label: "Sharia Audit Frequency", value: data.auditFrequency, sub: "Active" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label} className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {tile.label}
          </p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {tile.value}
          </p>
          <p className="text-xs text-muted-foreground">{tile.sub}</p>
        </Card>
      ))}
    </div>
  );
}
