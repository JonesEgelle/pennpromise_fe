"use client";

import { AlertTriangle, ChevronRight, ListFilter, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportIcon } from "@/components/icons/action-icons";
import {
  AlertBangIcon,
  AlertTriangleFillIcon,
  FileLinesIcon,
  GavelIcon,
  MosqueIcon,
  RebalanceIcon,
  WalletChipIcon,
} from "@/components/icons/status-icons";
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
  EthicalAlert,
} from "@/modules/complianceMonitoring/types";

const CARD_STATUS: Record<
  ComplianceCardStatus,
  { label: string; variant: "success" | "warning" | "destructive"; bar: string }
> = {
  halal_verified: {
    label: "HALAL VERIFIED",
    variant: "success",
    bar: "bg-success",
  },
  optimal: { label: "OPTIMAL", variant: "success", bar: "bg-info" },
  review_needed: {
    label: "REVIEW NEEDED",
    variant: "warning",
    bar: "bg-primary",
  },
  attention: { label: "ATTENTION", variant: "destructive", bar: "bg-primary" },
};

const STATUS_ICON: Record<ComplianceCardStatus, typeof WalletChipIcon> = {
  halal_verified: WalletChipIcon,
  review_needed: WalletChipIcon,
  optimal: GavelIcon,
  attention: WalletChipIcon,
};

const ALERT_ICON: Record<string, typeof AlertBangIcon> = {
  "riba-1": AlertBangIcon,
  "rebalance-1": RebalanceIcon,
};

// The Figma icon fills drive these: destructive alerts stay red, but the
// "warning" alert uses the coral brand tone, not the amber warning token.
const ALERT_TONE: Record<EthicalAlert["tone"], { text: string; chip: string }> =
  {
    destructive: { text: "text-destructive", chip: "bg-destructive/10" },
    warning: { text: "text-primary", chip: "bg-primary/10" },
    info: { text: "text-info", chip: "bg-info/10" },
  };

function IntegrityScoreCard({ data }: { data: ComplianceOverview }) {
  const tone = data.integrityScore >= 90 ? "text-info" : "text-warning";
  return (
    <Card className=" border-none flex h-full flex-col justify-between p-5 shadow-none">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Ethical Integrity Score
        </h3>
        <p className="text-xs text-muted-foreground">
          AAOIFI &amp; SEC Sharia Alignment
        </p>
      </div>
      <div>
        <div className="mt-4 flex items-end gap-3">
          <span className={cn("text-6xl text-[#001B44] font-bold", tone)}>
            {data.integrityScore}
          </span>
          <span className="pb-2">
            <StatDeltaBadge
              className="bg-transparent text-[#00439C] text-xl font-bold"
              value={data.integrityDelta}
              showIcon
            />
            <span className="block text-[11px] uppercase text-muted-foreground">
              vs last quarter
            </span>
          </span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        {data.integrityBars.map((_, index) => (
          <span
            key={index}
            className="h-1.5 flex-1 rounded-full bg-[#000666]"
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
        const Icon = STATUS_ICON[card.status];
        const positive = meta.variant === "success";
        return (
          <Card key={card.id} className=" p-4 shadow-none border-none">
            <div className="flex flex-col gap-3 p-2">
              <div className="flex items-start justify-between gap-2 ">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    positive
                      ? "bg-info/10 text-info"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wide font-bold p-2 rounded-[12px]",
                    meta.variant === "success" && "text-success bg-[#15803D0D]",
                    meta.variant === "warning" && "text-warning bg-[#FF95000D]",
                    meta.variant === "destructive" &&
                      "text-destructive bg-[#FF00000D]",
                  )}
                >
                  {meta.label}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {card.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className="mt-auto h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", meta.bar)}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
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
      className="h-full shadow-none "
      title="Ethical Compliance Alerts"
      icon={<AlertTriangleFillIcon className="size-5 text-primary" />}
      action={
        <button
          type="button"
          className="text-xs font-medium text-info hover:underline"
        >
          View All
        </button>
      }
    >
      <ul className="space-y-4 ">
        {data.alerts.map((alert) => {
          const tone = ALERT_TONE[alert.tone];
          const Icon = ALERT_ICON[alert.id] ?? AlertTriangle;
          return (
            <li key={alert.id} className="flex gap-3">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-[12px]",
                  tone.chip,
                  tone.text,
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {alert.title}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {alert.at}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {alert.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {alert.tags.map((tag, tagIndex) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                        tagIndex === 0
                          ? cn(tone.chip, tone.text)
                          : "bg-surface-muted text-text-secondary",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

const ALERT_TYPE_TONE: Record<
  ComplianceOverview["alertsByType"][number]["tone"],
  { bar: string; label: string }
> = {
  destructive: { bar: "bg-destructive/10", label: "text-destructive" },
  info: { bar: "bg-info/10", label: "text-info" },
  warning: { bar: "bg-warning-subtle", label: "text-primary" },
};

function AlertsByType({ data }: { data: ComplianceOverview }) {
  const max = Math.max(...data.alertsByType.map((slice) => slice.count), 1);
  return (
    <SectionCard
      title="Alerts by Compliance Type"
      titleClassName="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      className="h-full shadow-none border-none"
    >
      <div className="flex justify-center gap-4" style={{ height: 200 }}>
        {data.alertsByType.map((slice) => {
          const tone = ALERT_TYPE_TONE[slice.tone];
          return (
            <div key={slice.label} className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <span className={cn("text-sm font-bold", tone.label)}>
                  {slice.count}
                </span>
                <div
                  className={cn("w-full rounded-t-md", tone.bar)}
                  style={{ height: `${(slice.count / max) * 150}px` }}
                />
              </div>
              <span className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {slice.label}
              </span>
            </div>
          );
        })}
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
              <ExportIcon className="size-4" />
              Export Sharia Audit Report
            </Button>
          </>
        }
      />

      {isLoading || !data ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
            <IntegrityScoreCard data={data} />
            <div className="lg:col-span-2">
              <StatusCards data={data} />
            </div>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
            <AlertsPanel data={data} />

            <SectionCard
              title="Sharia Governance"
              className="h-full shadow-none border-none"
            >
              <div className="flex h-full flex-col gap-3">
                {data.governanceDocs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl bg-[#F8FAFC] p-4 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <FileLinesIcon
                      className="size-5 shrink-0 text-info"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">
                        {doc.title}
                      </span>
                      <span className="block text-[10px] uppercase text-muted-foreground">
                        {doc.subtitle}
                      </span>
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  </button>
                ))}
                <Button
                  className="mt-auto w-full"
                  size="lg"
                  isLoading={fatwaJob.isPending}
                  onClick={() => fatwaJob.mutate()}
                >
                  <Plus className="size-4" />
                  Generate Fatwa Certificate
                </Button>
              </div>
            </SectionCard>

            <div className="flex h-full flex-col gap-4 bg-surface p-4 rounded-[15px]">
              <Card className="p-5 shadow-none rounded-[8px]">
                <h3 className="text-base font-semibold text-foreground">
                  Sharia Governance
                </h3>
              </Card>

              <SectionCard
                title="Ethical Log"
                className="flex-1 shadow-none rounded-[8px]"
                action={
                  <ListFilter
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                }
              >
                <ol className="space-y-5">
                  {data.ethicalLog.map((entry, index) => {
                    const last = index === data.ethicalLog.length - 1;
                    return (
                      <li key={entry.id} className="relative flex gap-3">
                        {!last ? (
                          <span
                            className="absolute -bottom-7 left-3 top-6 w-px bg-border"
                            aria-hidden
                          />
                        ) : null}
                        <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-muted">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              index % 2 === 0 ? "bg-info" : "bg-primary",
                            )}
                            aria-hidden
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {entry.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.description}
                          </p>
                          <p className="mt-1 text-[11px] uppercase text-muted-foreground">
                            {entry.at} · ID: {entry.refId}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </SectionCard>
            </div>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_2fr]">
            <AlertsByType data={data} />

            <MetricPromoPanel
              className="h-full"
              title="Ready for Sharia Audit?"
              body={data.auditReadiness.narrative}
              watermark={<MosqueIcon className="h-52.5 w-auto" />}
              actions={
                <Button
                  className="h-11 rounded-[10px] bg-white px-6 text-primary hover:bg-white/90"
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
