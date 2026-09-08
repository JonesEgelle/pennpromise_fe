"use client";

import * as React from "react";
import { Download, ListFilter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { AutomatedFlagsList } from "@/modules/financialReconciliation/components/AutomatedFlagsList";
import { ManualReconTool } from "@/modules/financialReconciliation/components/ManualReconTool";
import { ReconStatsRow } from "@/modules/financialReconciliation/components/ReconStatsRow";
import { useReconOverview } from "@/modules/financialReconciliation/controllers/reconciliationController";

export function FinancialReconciliationView() {
  const [pickedId, setPickedId] = React.useState<string | null>(null);
  const { data, isFetching } = useReconOverview();

  const flags = data?.flags ?? [];
  const activeId =
    pickedId && flags.some((flag) => flag.id === pickedId)
      ? pickedId
      : (flags[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Reconciliation"
        description={
          data
            ? `Status: ${data.periodLabel} · ${data.flagsRemaining} Sharia compliance flags remaining`
            : "Reconcile the internal Halal ledger against settlement records."
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <ListFilter className="size-4" />
              Filter
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success("Report queued.")}
            >
              <Download className="size-4" />
              Export Sharia Audit Report
            </Button>
          </>
        }
      />

      {data ? <ReconStatsRow stats={data.stats} /> : null}

      <div className="grid gap-6 lg:h-[calc(100vh-20rem)] lg:grid-cols-[360px_1fr]">
        <AutomatedFlagsList
          flags={data?.flags}
          isLoading={isFetching && !data}
          selectedId={activeId}
          onSelect={setPickedId}
          newCount={data?.flagsRemaining ?? 0}
        />
        <ManualReconTool flagId={activeId} />
      </div>
    </div>
  );
}
