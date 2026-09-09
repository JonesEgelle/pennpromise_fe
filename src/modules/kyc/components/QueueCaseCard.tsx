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
        "relative w-full rounded-2xl bg-card p-5 text-left transition-colors ",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border border-primary" : " hover:border-primary/30 ",
      )}
    >
      {selected ? (
        <span
          className="absolute right-0 top-1/2 h-12 w-1.5 -translate-y-1/2 rounded-l-full bg-primary"
          aria-hidden
        />
      ) : null}

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
            highPriority ? "bg-primary/10 text-primary" : "bg-muted text-black",
          )}
        >
          {highPriority ? "High priority" : "Standard"}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-foreground">
          <Clock className="size-4 text-muted-foreground" aria-hidden />
          {formatQueueAge(kycCase.enqueuedAt)}
        </span>
      </div>

      <p className="mt-3 text-[16px] font-bold text-[#191C1E]">
        {kycCase.applicantName}
      </p>
      <p className="text-sm text-[#454652] font-[400]">
        {kycCase.tier} · {kycCase.location}
      </p>

      <div className="mt-3 flex items-center">
        <span className="flex">
          {kycCase.documentBadges.map((badge, index) => (
            <span
              key={badge}
              className={cn(
                "grid size-7 place-items-center rounded-full text-[10px] font-semibold ring-2 ring-card",
                index === 0
                  ? "bg-[#E0E0FF] text-text-secondary"
                  : "bg-[#D9E2FF] text-info",
                index > 0 && "-ml-1",
              )}
            >
              {badge}
            </span>
          ))}
        </span>
        <span className="ml-3 text-sm text-[#454652] font-[400]">
          Reviewing now
        </span>
      </div>
    </button>
  );
}
