import { ACCENT_FILL_CLASS, type AccentTone } from "@/components/shared/visual";
import { cn } from "@/lib/utils";

export interface BarListItem {
  label: string;
  /** 0–100. */
  percent: number;
  tone: AccentTone;
}

interface BarListProps {
  items: BarListItem[];
  /** Optional footnote rendered in a bordered box below the list. */
  note?: string;
  emptyMessage?: string;
  className?: string;
}

/** Labelled horizontal bars with a right-aligned percentage. */
export function BarList({
  items,
  note,
  emptyMessage = "No allocation data",
  className,
}: BarListProps) {
  if (items.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-text-secondary">{item.label}</span>
              <span className="font-medium text-foreground">
                {item.percent}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  ACCENT_FILL_CLASS[item.tone],
                )}
                style={{
                  width: `${Math.min(100, Math.max(0, item.percent))}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      {note ? (
        <p className="rounded-lg border border-border-subtle bg-muted/40 p-3 text-xs text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
}
