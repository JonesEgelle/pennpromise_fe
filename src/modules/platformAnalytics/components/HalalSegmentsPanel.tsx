import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils";
import type {
  HalalSegment,
  SegmentTier,
} from "@/modules/platformAnalytics/types";

function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const TIER_AVATAR: Record<SegmentTier, string> = {
  HNW: "bg-chart-blue/10 text-chart-blue",
  Retail: "bg-chart-green/10 text-chart-green",
  MSME: "bg-chart-red/10 text-chart-red",
};

export function HalalSegmentsPanel({ segments }: { segments: HalalSegment[] }) {
  return (
    <SectionCard
      title="Halal Segments"
      className="h-full rounded-[15px] shadow-none"
    >
      <ul className="space-y-4">
        {segments.map((segment) => (
          <li key={segment.id} className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-[12px] text-xs font-bold",
                TIER_AVATAR[segment.tier],
              )}
            >
              {initials(segment.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {segment.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {segment.stats}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
