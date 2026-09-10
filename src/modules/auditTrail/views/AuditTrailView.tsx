"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExportIcon } from "@/components/icons/action-icons";
import {
  AlertTriangleOutlineIcon,
  ShieldHalfIcon,
  TrendUpIcon,
} from "@/components/icons/status-icons";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { ActivityLogTable } from "@/modules/auditTrail/components/ActivityLogTable";
import {
  AuditFilters,
  type AuditFilterDraft,
} from "@/modules/auditTrail/components/AuditFilters";
import {
  useAuditList,
  useAuditStats,
} from "@/modules/auditTrail/controllers/auditTrailController";
import type { AuditListParams } from "@/modules/auditTrail/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Navy monitoring-load density ramp (#000666 at 10/20/40/60/80/100% alpha). */
const LOAD_DENSITY = [
  "#0006661A",
  "#00066633",
  "#00066666",
  "#00066699",
  "#000666CC",
  "#000666",
];

const NAVY = "#000666";

function CoverageDonut({ pct }: { pct: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);
  return (
    <svg viewBox="0 0 100 100" className="size-32">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={NAVY}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fill={NAVY}
        className="text-[22px] font-bold"
      >
        {pct}%
      </text>
    </svg>
  );
}

export function AuditTrailView() {
  const [page, setPage] = React.useState(1);
  const [applied, setApplied] = React.useState<AuditFilterDraft>({
    admin: "all",
    action: "all",
    module: "all",
    startDate: "",
    endDate: "",
  });

  const params: AuditListParams = { ...applied, page, pageSize: 10 };
  const { data, isFetching } = useAuditList(params);
  const { data: stats } = useAuditStats();

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ethical Audit Explorer"
        description="Immutable records of all administrative actions to ensure compliance with Sharia financial standards."
        breadcrumbs={[
          { label: "Sharia Governance" },
          { label: "Compliance Audit Trail" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Export started.")}
            >
              <ExportIcon className="size-4" />
              Export Log
            </Button>
            <Button size="sm" onClick={() => toast.success("Report queued.")}>
              <TrendUpIcon className="size-4" />
              Sharia Compliance Report
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <AuditFilters
          onApply={(draft) => {
            setApplied(draft);
            setPage(1);
          }}
        />
        <div className="space-y-4">
          <Card className="rounded-[15px] border-none bg-[#000666] p-5 text-surface-dark-foreground shadow-none">
            <div className="flex items-start justify-between">
              <ShieldHalfIcon className="size-5 text-white" aria-hidden />
              <span className="rounded-[6px] bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Last 24h
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold">
              {(stats?.logsTracked ?? 0).toLocaleString("en-NG")}
            </p>
            <p className="text-xs text-surface-dark-foreground/70">
              Compliance Logs Tracked
            </p>
          </Card>
          <Card className="rounded-[15px] p-5 shadow-none">
            <div className="flex items-start justify-between">
              <AlertTriangleOutlineIcon
                className="size-5 text-red-500"
                aria-hidden
              />
              <span className="rounded-[6px] bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-500">
                Risk Flags
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {String(stats?.nonComplianceAlerts ?? 0).padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground">
              Sharia Non-Compliance Alerts
            </p>
          </Card>
        </div>
      </div>

      <section className="space-y-3 rounded-[8px] border border-border ">
        <div className="flex items-center justify-between p-3">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Activity Logs
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span
              className="size-2 rounded-full bg-success animate-pulse"
              aria-hidden
            />
            Live Monitoring Active
          </span>
        </div>

        <ActivityLogTable
          data={data?.results}
          isLoading={isFetching && !data}
        />

        <div className="flex items-center justify-between p-3">
          <p className="text-sm text-muted-foreground">
            Showing {data?.results.length ?? 0} of {pagination?.count ?? 0}{" "}
            events
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={isFetching || (pagination?.page ?? 1) <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              Page {pagination?.page ?? 1} of {pagination?.total_pages ?? 1}
            </span>
            <Button
              variant="outline"
              disabled={
                isFetching ||
                (pagination?.page ?? 1) >= (pagination?.total_pages ?? 1)
              }
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <SectionCard
          className="rounded-[15px] shadow-none"
          title="Sharia Coverage"
        >
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <CoverageDonut pct={stats?.shariaCoveragePct ?? 0} />
            <p className="text-sm text-text-secondary">
              Audit log integrity confirmed for Sharia standards.{" "}
              {100 - (stats?.shariaCoveragePct ?? 0)}% pending Advisory Board
              validation.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          className="rounded-[15px] shadow-none"
          title="Compliance Monitoring Load"
          action={
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {[0, 2, 4, 5].map((level) => (
                <span
                  key={level}
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: LOAD_DENSITY[level] }}
                />
              ))}
              Density
            </div>
          }
        >
          <div className="space-y-3">
            {(stats?.monitoringLoad ?? []).map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-3">
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-14 rounded-[2px]"
                    style={{
                      backgroundColor:
                        LOAD_DENSITY[
                          Math.min(5, Math.floor(value * LOAD_DENSITY.length))
                        ],
                    }}
                    title={`${DAYS[colIndex]}: ${Math.round(value * 100)}%`}
                  />
                ))}
              </div>
            ))}
            <div className="grid grid-cols-7 gap-3 pt-2 text-center text-xs uppercase text-muted-foreground">
              {DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
