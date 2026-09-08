import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = NonNullable<BadgeProps["variant"]>;

/**
 * Map a raw status string to a display tone in ONE place. Modules that have
 * their own multi-flag status logic should derive the status with a pure
 * function first (see CLAUDE.md "Status derivation"), then pass the result here.
 */
const STATUS_TONE: Record<string, Tone> = {
  active: "success",
  approved: "success",
  verified: "success",
  completed: "success",
  resolved: "success",
  halal_active: "success",
  sharia_certified: "success",
  cleared: "success",

  pending: "warning",
  submitted: "warning",
  in_review: "warning",
  invited: "warning",
  processing: "warning",
  review_pending: "warning",
  flagged: "warning",

  inactive: "default",
  draft: "default",
  dormant: "default",
  not_certified: "default",
  under_review: "default",

  blocked: "destructive",
  rejected: "destructive",
  suspended: "destructive",
  failed: "destructive",
  removed: "destructive",
  restricted: "destructive",
};

function toLabel(status: string): string {
  return status
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status?.toLowerCase?.() ?? "";
  const tone = STATUS_TONE[key] ?? "default";
  return (
    <Badge variant={tone} className={cn(className)}>
      {toLabel(status ?? "unknown")}
    </Badge>
  );
}
