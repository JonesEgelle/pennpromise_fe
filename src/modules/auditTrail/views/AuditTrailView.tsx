"use client";

import * as React from "react";
import { AlertTriangle, Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils";
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

function CoverageDonut({ pct }: { pct: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);
  return (
    <svg viewBox="0 0 100 100" className="size-28">
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
        stroke="var(--info)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        className="fill-foreground text-[20px] font-semibold"
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
              <Download className="size-4" />
              Export Log
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success("Report queued.")}
            >
              <FileText className="size-4" />
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
          <Card className="bg-surface-dark p-5 text-surface-dark-foreground">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-surface-dark-foreground/60">
                Last 24h
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {(stats?.logsTracked ?? 0).toLocaleString("en-NG")}
            </p>
            <p className="text-xs text-surface-dark-foreground/70">
              Compliance Logs Tracked
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <AlertTriangle
                className="size-4 text-destructive"
                aria-hidden
              />
              <span className="rounded-full bg-destructive-subtle px-2 py-0.5 text-[10px] font-semibold uppercase text-destructive">
                Risk Flags
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {String(stats?.nonComplianceAlerts ?? 0).padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground">
              Sharia Non-Compliance Alerts
            </p>
          </Card>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Activity Logs
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            Live Monitoring Active
          </span>
        </div>

        <ActivityLogTable data={data?.results} isLoading={isFetching && !data} />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {data?.results.length ?? 0} of {pagination?.count ?? 0}{" "}
            events
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFetching || (pagination?.page ?? 1) <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
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
        <SectionCard title="Sharia Coverage">
          <div className="flex flex-col items-center gap-3 text-center">
            <CoverageDonut pct={stats?.shariaCoveragePct ?? 0} />
            <p className="text-xs text-muted-foreground">
              Audit log integrity confirmed for Sharia standards.{" "}
              {100 - (stats?.shariaCoveragePct ?? 0)}% pending Advisory Board
              validation.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Compliance Monitoring Load">
          <div className="space-y-2">
            {(stats?.monitoringLoad ?? []).map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-2">
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className={cn("h-9 rounded-md")}
                    style={{
                      backgroundColor: "var(--info)",
                      opacity: 0.15 + value * 0.7,
                    }}
                    title={`${DAYS[colIndex]}: ${Math.round(value * 100)}%`}
                  />
                ))}
              </div>
            ))}
            <div className="grid grid-cols-7 gap-2 pt-1 text-center text-[11px] text-muted-foreground">
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
