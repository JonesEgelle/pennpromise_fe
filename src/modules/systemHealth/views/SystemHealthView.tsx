"use client";

import { Check, CircleAlert, MapPin, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatDeltaBadge } from "@/components/shared/StatDeltaBadge";
import { cn } from "@/lib/utils";
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
  ok: <Check className="size-4 text-success" aria-label="OK" />,
  warn: <TriangleAlert className="size-4 text-warning" aria-label="Attention" />,
  error: <CircleAlert className="size-4 text-destructive" aria-label="Error" />,
};

const ALERT_META: Record<
  HealthAlertSeverity,
  { label: string; variant: "destructive" | "warning" | "info" }
> = {
  critical: { label: "CRITICAL", variant: "destructive" },
  warning: { label: "WARNING", variant: "warning" },
  info: { label: "INFO", variant: "info" },
};

function NodeMetricCard({
  metric,
}: {
  metric: SystemHealthData["nodes"][number];
}) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {metric.label}
        </p>
        <StatDeltaBadge value={metric.delta} />
      </div>
      <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
      <div className="flex items-end gap-1" style={{ height: 56 }}>
        {metric.bars.map((value, index) => (
          <span
            key={index}
            className="flex-1 rounded-sm bg-chart-blue/70"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    </Card>
  );
}

function HubStatusTable({ data }: { data: SystemHealthData }) {
  return (
    <SectionCard
      title="Ethical Product Hub Status"
      action={
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-success" /> Halal
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-warning" /> Audit Req.
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-destructive" /> Non-Compliant
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
                <th key={node.key} className="px-2 py-2 text-center font-medium">
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
                <td className="py-3 pl-3 text-right text-text-secondary">
                  {row.uptimePct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-6 border-t border-border pt-4 text-sm">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Sharia Advisory Resp.
          </p>
          <p className="font-semibold text-foreground">
            {data.hubFooter.advisoryRespMs}ms{" "}
            <span className="text-xs font-normal text-success">
              {data.hubFooter.advisoryDeltaMs}ms
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Non-Compliance Risk
          </p>
          <p className="font-semibold text-foreground">
            {data.hubFooter.nonComplianceRiskPct}%{" "}
            <span className="text-xs font-normal text-destructive">
              +{data.hubFooter.nonComplianceDeltaPct}%
            </span>
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function HealthAlerts({ data }: { data: SystemHealthData }) {
  const resolve = useResolveHealthAlert();
  const clearAll = useClearHealthAlerts();

  return (
    <SectionCard
      title={`Active Compliance Alerts (${data.alerts.length})`}
      action={
        <button
          type="button"
          className="text-xs font-medium text-info hover:underline disabled:opacity-50"
          disabled={clearAll.isPending || data.alerts.length === 0}
          onClick={() => clearAll.mutate()}
        >
          Clear All
        </button>
      }
    >
      {data.alerts.length === 0 ? (
        <p className="text-sm text-muted-foreground">All clear across regions.</p>
      ) : (
        <ul className="space-y-3">
          {data.alerts.map((alert) => {
            const meta = ALERT_META[alert.severity];
            return (
              <li
                key={alert.id}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {alert.at}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-foreground">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {alert.actions.map((action) => (
                    <Button
                      key={action}
                      size="sm"
                      variant={action === "acknowledge" ? "default" : "outline"}
                      disabled={resolve.isPending}
                      onClick={() => resolve.mutate(alert.id)}
                    >
                      {action === "acknowledge"
                        ? "Acknowledge"
                        : action === "dismiss"
                          ? "Dismiss"
                          : "Audit Status"}
                    </Button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
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
                <span className="size-2 rounded-full bg-success" /> Live Sync
              </span>
              <span className="rounded-md border border-border px-2 py-1">
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

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HubStatusTable data={data} />
            </div>
            <HealthAlerts data={data} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Ethical Capital Distribution"
              description="Real-time Sharia-compliant routing across Nigerian zones."
            >
              <div className="grid place-items-center rounded-xl bg-muted/40 py-10 text-center">
                <MapPin className="size-6 text-muted-foreground" aria-hidden />
                <p className="mt-2 text-sm font-medium text-foreground">
                  Hotspot: {data.distribution.hotspot}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ethereal volume {data.distribution.volume}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Local Ethical Health">
              <ul className="space-y-4">
                {data.localHealth.map((gauge) => (
                  <li key={gauge.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{gauge.label}</span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          gauge.tone === "green"
                            ? "text-success"
                            : "text-warning",
                        )}
                      >
                        {gauge.percent}% {gauge.statusLabel}
                      </span>
                    </div>
                    <Progress
                      value={gauge.percent}
                      indicatorClassName={
                        gauge.tone === "green" ? "bg-success" : "bg-warning"
                      }
                    />
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
