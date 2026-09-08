"use client";

import { ArrowRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate, formatNairaAmount } from "@/lib/utils";
import type {
  ReconFlag,
  ReconFlagKind,
} from "@/modules/financialReconciliation/types";

const KIND_COLOR: Record<ReconFlagKind, string> = {
  coupon_mismatch: "text-destructive",
  missing_log: "text-info",
  duplicate_entry: "text-warning",
};

function FlagCard({
  flag,
  selected,
  onSelect,
}: {
  flag: ReconFlag;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "w-full rounded-xl border border-l-2 p-3 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-border border-l-primary bg-primary/5"
          : "border-border border-l-transparent hover:bg-muted/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            KIND_COLOR[flag.kind],
          )}
        >
          {flag.title}
        </p>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(flag.at, "relative")}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{flag.txnId}</p>

      {flag.note ? (
        <p className="mt-2 rounded-md bg-muted/50 p-2 text-xs italic text-muted-foreground">
          {flag.note}
        </p>
      ) : (
        <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/40 p-2 text-xs">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground">{flag.internalLabel}</p>
            <p className="font-medium text-foreground">
              {flag.internalAmount === null
                ? "NULL"
                : formatNairaAmount(flag.internalAmount)}
            </p>
          </div>
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="min-w-0 flex-1 text-right">
            <p className="text-muted-foreground">{flag.providerLabel}</p>
            <p className="font-medium text-destructive">
              {flag.providerAmount === null
                ? "—"
                : formatNairaAmount(flag.providerAmount)}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}

interface AutomatedFlagsListProps {
  flags: ReconFlag[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  newCount: number;
}

export function AutomatedFlagsList({
  flags,
  isLoading,
  selectedId,
  onSelect,
  newCount,
}: AutomatedFlagsListProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Automated Flags
        </h3>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
          {newCount} New
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {isLoading && !flags ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))
        ) : !flags || flags.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            All flags cleared for this period.
          </p>
        ) : (
          flags.map((flag) => (
            <FlagCard
              key={flag.id}
              flag={flag}
              selected={flag.id === selectedId}
              onSelect={() => onSelect(flag.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
