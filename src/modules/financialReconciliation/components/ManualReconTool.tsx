"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatNairaAmount } from "@/lib/utils";
import {
  useReconLedger,
  useResolveFlag,
  useSkipFlag,
} from "@/modules/financialReconciliation/controllers/reconciliationController";
import { RECON_REASON_OPTIONS } from "@/modules/financialReconciliation/lib/mock-data";
import type {
  ReconLedgerEntry,
  ReconResolutionReason,
} from "@/modules/financialReconciliation/types";

function LedgerTable({
  title,
  rows,
}: {
  title: string;
  rows: ReconLedgerEntry[];
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-border last:border-b-0",
                  row.mismatch && "bg-destructive-subtle/50",
                )}
              >
                <td className="px-3 py-2 text-text-secondary">{row.date}</td>
                <td className="px-3 py-2 text-text-secondary">{row.id}</td>
                <td
                  className={cn(
                    "px-3 py-2 text-right font-medium",
                    row.mismatch ? "text-destructive" : "text-foreground",
                  )}
                >
                  {formatNairaAmount(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ManualReconToolProps {
  flagId: string | null;
}

export function ManualReconTool({ flagId }: ManualReconToolProps) {
  const [autoMatch, setAutoMatch] = React.useState(true);
  const [reason, setReason] = React.useState<ReconResolutionReason | "">("");
  const resolve = useResolveFlag();
  const skip = useSkipFlag();

  const { data, isLoading } = useReconLedger(flagId);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Manual Reconciliation Tool
          </h3>
          <p className="text-xs text-muted-foreground">
            Comparing Internal Ledger vs. Islamic Banking Settlement Record.
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          Auto-match similarity &gt; 95%
          <Switch checked={autoMatch} onCheckedChange={setAutoMatch} />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!flagId ? (
          <p className="grid h-full place-items-center text-sm text-muted-foreground">
            Select a flag to reconcile.
          </p>
        ) : isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="flex flex-col gap-4 md:flex-row">
            <LedgerTable title="Internal Ledger" rows={data.internal} />
            <LedgerTable
              title={`Provider: ${data.providerName}`}
              rows={data.provider}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center">
        <span className="text-sm text-text-secondary">Resolve as:</span>
        <Select
          value={reason}
          onValueChange={(value) =>
            setReason(value as ReconResolutionReason)
          }
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            {RECON_REASON_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!flagId || skip.isPending}
            onClick={() => flagId && skip.mutate(flagId)}
          >
            Skip
          </Button>
          <Button
            size="sm"
            isLoading={resolve.isPending}
            disabled={!flagId || !reason}
            onClick={() =>
              flagId &&
              reason &&
              resolve.mutate({ flagId, reason })
            }
          >
            Approve Match
          </Button>
        </div>
      </div>
    </div>
  );
}
