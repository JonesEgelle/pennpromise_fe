import { TrendingDown, TrendingUp } from "lucide-react";

import { cn, formatSignedPercent } from "@/lib/utils";

interface StatDeltaBadgeProps {
  /** Percentage change. `null` / `undefined` renders nothing. */
  value: number | null | undefined;
  className?: string;
  /** Prefix the value with a trend arrow (Figma's integrity-score style). */
  showIcon?: boolean;
}

/**
 * A period-over-period change chip. Colour follows the SIGN of the change, not
 * the metric (dossier rule) — up is success, down is destructive.
 */
export function StatDeltaBadge({
  value,
  className,
  showIcon,
}: StatDeltaBadgeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        positive
          ? "bg-success-subtle text-success"
          : "bg-destructive-subtle text-destructive",
        className,
      )}
    >
      {showIcon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      {formatSignedPercent(value)}
    </span>
  );
}
