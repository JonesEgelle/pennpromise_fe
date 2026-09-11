"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangleFillIcon,
  CheckCircleIcon,
  ErrorCircleIcon,
  GavelIcon,
  ShieldComplianceIcon,
  TrendUpIcon,
} from "@/components/icons/status-icons";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn, formatSignedPercent } from "@/lib/utils";
import {
  useClearHealthAlerts,
  useResolveHealthAlert,
  useSystemHealth,
} from "@/modules/systemHealth/controllers/systemHealthController";
import type {
  HealthAlertSeverity,
  HubCellStatus,
  SystemHealthData,
} from "@/modules/systemHealth/types";

const HUB_ICON: Record<HubCellStatus, React.ReactNode> = {
  ok: <CheckCircleIcon className="size-5 text-green-500" aria-label="OK" />,
  warn: (
    <AlertTriangleFillIcon
      className="size-5 text-amber-500"
      aria-label="Attention"
    />
  ),
  error: <ErrorCircleIcon className="size-5 text-primary" aria-label="Error" />,
};

/** Uptime pill colour — matches the hub legend (green / amber / coral). */
function uptimeChipClass(pct: number): string {
  if (pct >= 99.99) return "bg-success-subtle text-success";
  if (pct >= 99) return "bg-warning-subtle text-warning";
  return "bg-destructive-subtle text-destructive";
}

/** Whole numbers show one decimal ("100.0%"); others render as-is. */
function formatUptime(pct: number): string {
  return Number.isInteger(pct) ? `${pct.toFixed(1)}%` : `${pct}%`;
}

const ALERT_META: Record<
  HealthAlertSeverity,
  { label: string; badge: string; stripe: string; ackClass: string }
> = {
  critical: {
    label: "CRITICAL",
    badge: "bg-primary text-primary-foreground",
    stripe: "border-l-primary",
    ackClass: "",
  },
  warning: {
    label: "WARNING",
    badge: "bg-warning-subtle text-warning",
    stripe: "border-l-border-subtle",
    ackClass: "bg-chart-series-users text-white hover:bg-chart-series-users/90",
  },
  info: {
    label: "INFO",
    badge: "bg-info/10 text-info",
    stripe: "border-l-border-subtle",
    ackClass: "",
  },
};

function NodeMetricCard({
  metric,
}: {
  metric: SystemHealthData["nodes"][number];
}) {
  const positive = metric.delta >= 0;
  const valueColor =
    metric.tone === "gold" ? "text-chart-gold" : "text-chart-series-users";
  const barColor = metric.tone === "gold" ? "bg-chart-gold" : "bg-chart-blue";
  const deltaColor =
    metric.delta < 0
      ? "text-chart-series-users"
      : metric.tone === "gold"
        ? "text-chart-red"
        : "text-chart-blue";
  const maxBar = Math.max(...metric.bars, 1);

  return (
    <Card className="space-y-3 rounded-[20px] p-4 shadow-none">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {metric.label}
        </p>
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-semibold",
            deltaColor,
          )}
        >
          <TrendUpIcon
            className={cn("h-2.5 w-auto", !positive && "-scale-y-100")}
            aria-hidden
          />
          {formatSignedPercent(metric.delta)}
        </span>
      </div>
      <p className={cn("text-2xl font-bold", valueColor)}>{metric.value}</p>
      <div className="flex items-end gap-1" style={{ height: 56 }}>
        {metric.bars.map((value, index) => (
          <span
            key={index}
            className={cn("flex-1 rounded-[3px]", barColor)}
            style={{
              height: `${value}%`,
              opacity: 0.28 + (value / maxBar) * 0.72,
            }}
          />
        ))}
      </div>
    </Card>
  );
}

function HubStatusTable({ data }: { data: SystemHealthData }) {
  return (
    <SectionCard
      className=" rounded-[15px] shadow-none"
      title="Ethical Product Hub Status"
      action={
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-green-500" /> Halal
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500" /> Audit Req.
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" /> Non-Compliant
          </span>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Investment Product</th>
              {data.hubNodes.map((node) => (
                <th
                  key={node.key}
                  className="px-2 py-2 text-center font-medium"
                >
                  {node.label}
                </th>
              ))}
              <th className="py-2 pl-3 text-right font-medium">
                Compliance Uptime
              </th>
            </tr>
          </thead>
          <tbody>
            {data.hubRows.map((row) => (
              <tr
                key={row.product}
                className="border-b border-border last:border-b-0"
              >
                <td className="py-3 pr-3 font-medium text-foreground">
                  {row.product}
                </td>
                {data.hubNodes.map((node) => (
                  <td key={node.key} className="px-2 py-3">
                    <span className="grid place-items-center">
                      {HUB_ICON[row.statuses[node.key] ?? "ok"]}
                    </span>
                  </td>
                ))}
                <td className="py-3 pl-3 text-center">
                  <span
                    className={cn(
                      "inline-block rounded-md px-2.5 py-1 text-xs font-medium",
                      uptimeChipClass(row.uptimePct),
                    )}
                  >
                    {formatUptime(row.uptimePct)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-8 border-t border-border pt-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-info/10 text-chart-series-users">
            <GavelIcon className="size-4.5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sharia Advisory Resp.
            </p>
            <p className="text-2xl font-bold text-foreground">
              {data.hubFooter.advisoryRespMs}ms{" "}
              <span className="text-sm font-medium text-success">
                {data.hubFooter.advisoryDeltaMs}ms
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary/10 text-primary">
            <ShieldComplianceIcon className="size-4.5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Non-Compliance Risk
            </p>
            <p className="text-2xl font-bold text-foreground">
              {data.hubFooter.nonComplianceRiskPct}%{" "}
              <span className="text-sm font-medium text-primary">
                +{data.hubFooter.nonComplianceDeltaPct}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function HealthAlerts({ data }: { data: SystemHealthData }) {
  const resolve = useResolveHealthAlert();
  const clearAll = useClearHealthAlerts();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[15px] border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h3 className="flex items-center gap-2 text-[14px] font-bold text-foreground">
          Active Compliance Alerts
          <span className="rounded-[9px] bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-bold text-[#FF695B]">
            {data.alerts.length}
          </span>
        </h3>
        <button
          type="button"
          className="shrink-0 text-[12px] font-bold text-foreground hover:underline disabled:opacity-50"
          disabled={clearAll.isPending || data.alerts.length === 0}
          onClick={() => clearAll.mutate()}
        >
          Clear All
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto  scrollbar-hide">
        {data.alerts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            All clear across regions.
          </p>
        ) : (
          data.alerts.map((alert) => {
            const meta = ALERT_META[alert.severity];
            return (
              <div
                key={alert.id}
                className={cn(
                  "border-l-4 p-3 transition-colors hover:bg-muted/40",
                  meta.stripe,
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-[2px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                      meta.badge,
                    )}
                  >
                    {meta.label}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {alert.at}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {alert.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {alert.description}
                </p>
                <div className="mt-3 flex gap-2">
                  {alert.actions.map((action) => {
                    const isPrimary = action === "acknowledge";
                    const solo = alert.actions.length === 1;
                    return (
                      <Button
                        key={action}
                        variant={isPrimary ? "default" : "outline"}
                        className={cn(
                          "h-11 rounded-[10px]",
                          isPrimary || solo ? "flex-1" : "shrink-0",
                          isPrimary && meta.ackClass,
                        )}
                        disabled={resolve.isPending}
                        onClick={() => resolve.mutate(alert.id)}
                      >
                        {action === "acknowledge"
                          ? "Acknowledge"
                          : action === "dismiss"
                            ? "Dismiss"
                            : "Audit Status"}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function SystemHealthView() {
  const { data, isLoading } = useSystemHealth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health & Monitoring"
        description="Real-time Sharia compliance monitoring across Kano, Lagos, Abuja, and Port Harcourt nodes."
        actions={
          data ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-success">
                <span className="size-2 rounded-full bg-success animate-pulse" />{" "}
                Live Sync
              </span>
              <span className="rounded-[4px] text-surface-dark font-bold bg-[#ECEEF0] border border-border px-2 py-1">
                Last Sync: {data.lastSync}
              </span>
            </span>
          ) : null
        }
      />

      {isLoading || !data ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {data.nodes.map((metric) => (
              <NodeMetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HubStatusTable data={data} />
            </div>
            {/* Absolute fill on lg so the alerts list matches the hub table's
                height exactly and scrolls internally instead of growing the row. */}
            <div className="relative">
              <div className="lg:absolute lg:inset-0">
                <HealthAlerts data={data} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="relative min-h-72 overflow-hidden rounded-[15px] bg-muted shadow-none">
              {/* TODO(map-api): static Nigeria network map fills the card until
                  the live routing map API is integrated. */}
              <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/nigeria-network-map.svg')" }}
                aria-hidden
              />
              <div className="relative p-5">
                <h3 className="text-base font-semibold text-foreground">
                  Ethical Capital Distribution
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time Sharia-compliant routing across Nigerian zones
                </p>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-3">
                <div className="rounded-[4px] border border-border bg-card px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Hotspot
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {data.distribution.hotspot}
                  </p>
                </div>
                <div className="rounded-[4px] border border-border bg-card px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Ethereal Volume
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {data.distribution.volume}
                  </p>
                </div>
              </div>
            </Card>

            <SectionCard
              className="rounded-[15px] shadow-none"
              title="Local Ethical Health"
            >
              <ul className="space-y-6">
                {data.localHealth.map((gauge) => {
                  const isGreen = gauge.tone === "green";
                  return (
                    <li key={gauge.label} className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-foreground">{gauge.label}</span>
                        <span
                          className={cn(
                            "font-medium",
                            isGreen ? "text-green-500" : "text-amber-500",
                          )}
                        >
                          {gauge.percent}% {gauge.statusLabel}
                        </span>
                      </div>
                      <Progress
                        value={gauge.percent}
                        className="h-2"
                        indicatorClassName={
                          isGreen ? "bg-green-500" : "bg-amber-500"
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
