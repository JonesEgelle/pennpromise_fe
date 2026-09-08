import { cn, formatSignedPercent } from "@/lib/utils";

interface StatDeltaBadgeProps {
  /** Percentage change. `null` / `undefined` renders nothing. */
  value: number | null | undefined;
  className?: string;
}

/**
 * A period-over-period change chip. Colour follows the SIGN of the change, not
 * the metric (dossier rule) — up is success, down is destructive.
 */
export function StatDeltaBadge({ value, className }: StatDeltaBadgeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        positive
          ? "bg-success-subtle text-success"
          : "bg-destructive-subtle text-destructive",
        className,
      )}
    >
      {formatSignedPercent(value)}
    </span>
  );
}
