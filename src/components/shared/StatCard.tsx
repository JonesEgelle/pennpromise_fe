import type { ComponentType } from "react";

import { Card } from "@/components/ui/card";
import { StatDeltaBadge } from "@/components/shared/StatDeltaBadge";
import {
  ACCENT_CHIP_CLASS,
  ACCENT_FILL_CLASS,
  type AccentTone,
} from "@/components/shared/visual";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  /** Any icon component that accepts `className` — lucide or a project SVG. */
  icon: ComponentType<{ className?: string }>;
  delta?: number | null;
  /** Optional mini-bar under the value (0–100). */
  accent?: { percent: number; tone: AccentTone };
  className?: string;
}

/** KPI tile: icon chip + delta chip, small-caps label, big value, accent bar. */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  accent,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("flex flex-col rounded-[15px] gap-4 p-5", className)}>
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-[8px]",
            accent
              ? ACCENT_CHIP_CLASS[accent.tone]
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <StatDeltaBadge value={delta} />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
      </div>

      {accent ? (
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="presentation"
        >
          <div
            className={cn(
              "h-full rounded-full",
              ACCENT_FILL_CLASS[accent.tone],
            )}
            style={{
              width: `${Math.min(100, Math.max(0, accent.percent))}%`,
            }}
          />
        </div>
      ) : null}
    </Card>
  );
}
