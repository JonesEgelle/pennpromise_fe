import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatQueueAge } from "@/modules/kyc/lib/queue-timer";
import type { KycCase } from "@/modules/kyc/types";

interface QueueCaseCardProps {
  kycCase: KycCase;
  selected: boolean;
  onSelect: () => void;
}

export function QueueCaseCard({
  kycCase,
  selected,
  onSelect,
}: QueueCaseCardProps) {
  const highPriority = kycCase.priority === "high_priority";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "w-full rounded-xl border bg-card p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary shadow-sm"
          : "border-border hover:border-primary/40",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            highPriority
              ? "bg-destructive-subtle text-destructive"
              : "bg-muted text-muted-foreground",
          )}
        >
          {highPriority ? "High priority" : "Standard"}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          {formatQueueAge(kycCase.enqueuedAt)}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-foreground">
        {kycCase.applicantName}
      </p>
      <p className="text-xs text-muted-foreground">
        {kycCase.tier} · {kycCase.location}
      </p>

      <p className="mt-2 text-xs font-medium text-primary">Reviewing now</p>
    </button>
  );
}
