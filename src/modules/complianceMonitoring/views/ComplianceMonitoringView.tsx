"use client";

import {
  AlertTriangle,
  Download,
  FileCheck2,
  ListFilter,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricPromoPanel } from "@/components/shared/MetricPromoPanel";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatDeltaBadge } from "@/components/shared/StatDeltaBadge";
import { cn } from "@/lib/utils";
import {
  useComplianceJob,
  useComplianceOverview,
} from "@/modules/complianceMonitoring/controllers/complianceController";
import type {
  ComplianceCardStatus,
  ComplianceOverview,
} from "@/modules/complianceMonitoring/types";

const CARD_STATUS: Record<
  ComplianceCardStatus,
  { label: string; variant: "success" | "warning" | "destructive"; bar: string }
> = {
  halal_verified: { label: "HALAL VERIFIED", variant: "success", bar: "bg-success" },
  optimal: { label: "OPTIMAL", variant: "success", bar: "bg-info" },
  review_needed: { label: "REVIEW NEEDED", variant: "warning", bar: "bg-primary" },
  attention: { label: "ATTENTION", variant: "destructive", bar: "bg-primary" },
};

function IntegrityScoreCard({ data }: { data: ComplianceOverview }) {
  const tone = data.integrityScore >= 90 ? "text-info" : "text-warning";
  return (
    <Card className="flex h-full flex-col justify-between p-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Ethical Integrity Score
        </h3>
        <p className="text-xs text-muted-foreground">
          AAOIFI &amp; SEC Sharia Alignment
        </p>
        <div className="mt-4 flex items-end gap-3">
          <span className={cn("text-5xl font-semibold", tone)}>
            {data.integrityScore}
          </span>
          <span className="pb-2">
            <StatDeltaBadge value={data.integrityDelta} />
            <span className="block text-[11px] uppercase text-muted-foreground">
              vs last quarter
            </span>
          </span>
        </div>
      </div>
      <div className="mt-6 flex items-end gap-1.5">
        {data.integrityBars.map((value, index) => (
          <span
            key={index}
            className="flex-1 rounded-sm bg-surface-dark"
            style={{ height: `${8 + value * 0.4}px` }}
          />
        ))}
      </div>
    </Card>
  );
}

function StatusCards({ data }: { data: ComplianceOverview }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.statusCards.map((card) => {
        const meta = CARD_STATUS[card.status];
        return (
          <Card key={card.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <ShieldCheck
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide",
                  meta.variant === "success" && "text-success",
                  meta.variant === "warning" && "text-warning",
                  meta.variant === "destructive" && "text-destructive",
                )}
              >
                {meta.label}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {card.title}
              </p>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </div>
            <div className="mt-auto h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", meta.bar)}
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AlertsPanel({ data }: { data: ComplianceOverview }) {
  return (
    <SectionCard
      title="Ethical Compliance Alerts"
      action={
        <button
          type="button"
          className="text-xs font-medium text-info hover:underline"
        >
          View All
        </button>
      }
    >
      <ul className="space-y-4">
        {data.alerts.map((alert) => (
          <li key={alert.id} className="flex gap-3">
            <AlertTriangle
              className={cn(
                "mt-0.5 size-4 shrink-0",
                alert.tone === "destructive" && "text-destructive",
                alert.tone === "warning" && "text-warning",
                alert.tone === "info" && "text-info",
              )}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {alert.title}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {alert.at}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {alert.description}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {alert.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function AlertsByType({ data }: { data: ComplianceOverview }) {
  const max = Math.max(...data.alertsByType.map((slice) => slice.count), 1);
  return (
    <SectionCard title="Alerts by Compliance Type">
      <div className="flex items-end justify-around gap-3" style={{ height: 140 }}>
        {data.alertsByType.map((slice) => (
          <div key={slice.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {slice.count}
            </span>
            <div
              className={cn(
                "w-full rounded-t-md",
                slice.tone === "destructive" && "bg-destructive-subtle",
                slice.tone === "info" && "bg-info/20",
                slice.tone === "warning" && "bg-warning-subtle",
              )}
              style={{ height: `${(slice.count / max) * 100}%` }}
            />
            <span className="text-[11px] uppercase text-muted-foreground">
              {slice.label}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function ComplianceMonitoringView() {
  const { data, isLoading } = useComplianceOverview();
  const fatwaJob = useComplianceJob("Fatwa certificate generation queued.");
  const integrityJob = useComplianceJob("Sharia integrity check started.");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Monitoring"
        description="Real-time AAOIFI & SEC Sharia alignment across the platform."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ListFilter className="size-4" />
              Filter
            </Button>
            <Button size="sm" onClick={() => toast.success("Report queued.")}>
              <Download className="size-4" />
              Export Sharia Audit Report
            </Button>
          </>
        }
      />

      {isLoading || !data ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <IntegrityScoreCard data={data} />
            <div className="lg:col-span-2">
              <StatusCards data={data} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AlertsPanel data={data} />
            </div>
            <SectionCard title="Sharia Governance">
              <div className="space-y-2">
                {data.governanceDocs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg border border-border p-3 text-left text-sm hover:bg-muted/40"
                  >
                    <FileCheck2
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span>
                      <span className="block font-medium text-foreground">
                        {doc.title}
                      </span>
                      <span className="block text-[10px] uppercase text-muted-foreground">
                        {doc.subtitle}
                      </span>
                    </span>
                  </button>
                ))}
                <Button
                  className="w-full"
                  size="sm"
                  isLoading={fatwaJob.isPending}
                  onClick={() => fatwaJob.mutate()}
                >
                  Generate Fatwa Certificate
                </Button>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard title="Ethical Log">
              <ol className="space-y-4">
                {data.ethicalLog.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-info"
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {entry.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.description}
                      </p>
                      <p className="text-[11px] uppercase text-muted-foreground">
                        {entry.at} · ID: {entry.refId}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </SectionCard>

            <AlertsByType data={data} />

            <MetricPromoPanel
              title="Ready for Sharia Audit?"
              body={data.auditReadiness.narrative}
              actions={
                <Button
                  size="sm"
                  className="border border-white/40 bg-transparent text-primary-foreground hover:bg-white/15"
                  isLoading={integrityJob.isPending}
                  onClick={() => integrityJob.mutate()}
                >
                  Run Sharia Integrity Check
                </Button>
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
