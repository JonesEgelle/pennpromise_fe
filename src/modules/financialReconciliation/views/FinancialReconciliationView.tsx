"use client";

import * as React from "react";
import { ListFilter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ExportIcon } from "@/components/icons/action-icons";
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
        className="font-bold"
        title="Financial Reconciliation"
        description={
          data ? (
            <>
              Status: {data.periodLabel} ·{" "}
              <span className="text-primary">
                {data.flagsRemaining} Sharia compliance flags remaining
              </span>
            </>
          ) : (
            "Reconcile the internal Halal ledger against settlement records."
          )
        }
        actions={
          <>
            <Button variant="outline">
              <ListFilter className="size-4" />
              Filter
            </Button>
            <Button onClick={() => toast.success("Report queued.")}>
              <ExportIcon className="size-4" />
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
