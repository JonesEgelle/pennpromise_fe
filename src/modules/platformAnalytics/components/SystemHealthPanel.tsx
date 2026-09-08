import { Database, Server, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils";
import type {
  HealthRollup,
  HealthStatus,
  SystemHealthComponentStatus,
} from "@/modules/platformAnalytics/types";

const ROW_ICON = [Server, Database, ShieldCheck];

const STATUS_DOT: Record<HealthStatus, string> = {
  live: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
};

const STATUS_LABEL: Record<HealthStatus, string> = {
  live: "LIVE",
  degraded: "DEGRADED",
  down: "DOWN",
};

const ROLLUP_BADGE: Record<
  HealthRollup,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  operational: { label: "OPERATIONAL", variant: "success" },
  degraded: { label: "DEGRADED", variant: "warning" },
  outage: { label: "OUTAGE", variant: "destructive" },
};

/** operational iff every component is live; any down → outage; else degraded. */
function rollup(components: SystemHealthComponentStatus[]): HealthRollup {
  if (components.some((component) => component.status === "down")) {
    return "outage";
  }
  if (components.some((component) => component.status !== "live")) {
    return "degraded";
  }
  return "operational";
}

export function SystemHealthPanel({
  components,
}: {
  components: SystemHealthComponentStatus[];
}) {
  const badge = ROLLUP_BADGE[rollup(components)];

  return (
    <SectionCard
      title="System Health"
      action={<Badge variant={badge.variant}>{badge.label}</Badge>}
    >
      <ul className="space-y-4">
        {components.map((component, index) => {
          const Icon = ROW_ICON[index % ROW_ICON.length];
          return (
            <li key={component.id} className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {component.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {component.detail}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    STATUS_DOT[component.status],
                  )}
                  aria-hidden
                />
                {STATUS_LABEL[component.status]}
              </span>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
