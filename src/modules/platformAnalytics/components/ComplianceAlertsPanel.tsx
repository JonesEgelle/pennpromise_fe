"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type Column,
  type RowAction,
} from "@/components/shared/DataTable";
import { APP_ROUTES } from "@/constants/routes";
import type {
  AlertSeverity,
  ComplianceAlert,
} from "@/modules/platformAnalytics/types";

const SEVERITY_VARIANT: Record<
  AlertSeverity,
  "destructive" | "warning" | "info"
> = {
  high: "destructive",
  medium: "warning",
  info: "info",
};

/** Top slice of the compliance queue. Full list lives in Compliance Monitoring. */
export function ComplianceAlertsPanel({
  alerts,
}: {
  alerts: ComplianceAlert[];
}) {
  const router = useRouter();

  const columns = React.useMemo<Column<ComplianceAlert>[]>(
    () => [
      {
        key: "severity",
        header: "Severity",
        width: "110px",
        render: (row) => (
          <Badge variant={SEVERITY_VARIANT[row.severity]}>
            {row.severity.toUpperCase()}
          </Badge>
        ),
      },
      {
        key: "source",
        header: "Source",
        render: (row) => (
          <span className="font-medium text-foreground">{row.source}</span>
        ),
      },
      {
        key: "issue",
        header: "Issue",
        render: (row) => (
          <span className="line-clamp-1 text-text-secondary" title={row.issue}>
            {row.issue}
          </span>
        ),
      },
    ],
    [],
  );

  const rowActions = React.useMemo<RowAction<ComplianceAlert>[]>(
    () => [
      {
        label: "View in Compliance Monitoring",
        onSelect: () => router.push(APP_ROUTES.COMPLIANCE_MONITORING),
      },
    ],
    [router],
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Compliance Alerts (NG)
        </h3>
        <Link
          href={APP_ROUTES.COMPLIANCE_MONITORING}
          className="text-xs font-medium text-info hover:underline"
        >
          VIEW ALL
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={alerts}
        getRowId={(row) => row.id}
        rowActions={rowActions}
        emptyMessage="No compliance alerts."
      />
    </section>
  );
}
