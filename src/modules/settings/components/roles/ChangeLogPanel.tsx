"use client";

import { GitCommitVertical } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn, formatDate } from "@/lib/utils";
import { useRolesChangeLog } from "@/modules/settings/controllers/settingsController";
import type { ChangeLogKind } from "@/modules/settings/types";

const KIND_DOT: Record<ChangeLogKind, string> = {
  matrix_update: "text-info",
  role_created: "text-success",
  unauthorized_access: "text-destructive",
};

export function ChangeLogPanel() {
  const { data, isLoading } = useRolesChangeLog();

  return (
    <SectionCard title="Change Log & Audit Matrix">
      {isLoading && !data ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No changes recorded yet.
        </p>
      ) : (
        <ol className="space-y-4">
          {data.map((entry) => (
            <li key={entry.id} className="flex gap-3">
              <GitCommitVertical
                className={cn("mt-0.5 size-4 shrink-0", KIND_DOT[entry.kind])}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {entry.title}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(entry.at, "relative")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{entry.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
