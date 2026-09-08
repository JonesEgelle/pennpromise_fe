import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionCard } from "@/components/shared/SectionCard";
import type { HalalSegment } from "@/modules/platformAnalytics/types";

function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function HalalSegmentsPanel({
  segments,
}: {
  segments: HalalSegment[];
}) {
  return (
    <SectionCard title="Halal Segments">
      <ul className="space-y-4">
        {segments.map((segment) => (
          <li key={segment.id} className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback>{initials(segment.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
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
