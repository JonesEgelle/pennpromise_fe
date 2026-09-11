"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendUpIcon } from "@/components/icons/status-icons";
import { formatDate } from "@/lib/utils";
import { useRolesChangeLog } from "@/modules/settings/controllers/settingsController";

export function ChangeLogPanel() {
  const { data, isLoading } = useRolesChangeLog();

  return (
    <Card className="overflow-hidden rounded-[15px] shadow-none">
      <div className="border-b border-border bg-surface-muted px-5 py-4">
        <h3 className="text-base font-semibold text-foreground">
          Change Log &amp; Audit Matrix
        </h3>
      </div>

      <div className="p-5">
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
          <ol className="divide-y divide-border">
            {data.map((entry) => (
              <li key={entry.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                  <TrendUpIcon
                    className="h-2.5 w-auto text-foreground"
                    aria-hidden
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {entry.title}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(entry.at, "relative")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.detail}
                    {entry.highlight ? (
                      <>
                        {" "}
                        <span className="font-medium text-primary">
                          {entry.highlight}
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  );
}
