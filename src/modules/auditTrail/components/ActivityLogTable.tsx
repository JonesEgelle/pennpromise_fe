"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type Column,
} from "@/components/shared/DataTable";
import { cn, formatDate } from "@/lib/utils";
import type { AuditAction, AuditEntry } from "@/modules/auditTrail/types";

const ACTION_META: Record<
  AuditAction,
  { label: string; variant: "success" | "info" | "destructive" | "warning" }
> = {
  create: { label: "CREATE", variant: "success" },
  update: { label: "UPDATE", variant: "info" },
  delete: { label: "DELETE", variant: "destructive" },
  security_login: { label: "SECURITY LOGIN", variant: "warning" },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ChangeDiff({ change }: { change: AuditEntry["change"] }) {
  if (!change) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="flex flex-wrap items-center gap-1.5 text-xs">
      {change.old !== null ? (
        <span className="rounded bg-destructive-subtle px-1.5 py-0.5 text-destructive">
          {change.field}: {change.old}
        </span>
      ) : null}
      {change.new !== null ? (
        <span className="rounded bg-success-subtle px-1.5 py-0.5 text-success">
          {change.field}: {change.new}
        </span>
      ) : null}
    </span>
  );
}

interface ActivityLogTableProps {
  data: AuditEntry[] | undefined;
  isLoading: boolean;
}

export function ActivityLogTable({ data, isLoading }: ActivityLogTableProps) {
  const columns = React.useMemo<Column<AuditEntry>[]>(
    () => [
      {
        key: "at",
        header: "Timestamp",
        render: (row) => (
          <span className="whitespace-nowrap text-xs">
            {formatDate(row.at, "datetime")}
          </span>
        ),
      },
      {
        key: "admin",
        header: "Administrator",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback>{initials(row.adminName)}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="font-medium text-foreground">{row.adminName}</p>
              <p className="text-xs text-muted-foreground">ID: {row.adminId}</p>
            </div>
          </div>
        ),
      },
      {
        key: "action",
        header: "Action",
        render: (row) => (
          <Badge variant={ACTION_META[row.action].variant}>
            {ACTION_META[row.action].label}
          </Badge>
        ),
      },
      {
        key: "module",
        header: "Module / Target",
        render: (row) => (
          <div className="leading-tight">
            <p className="font-medium text-foreground">{row.module}</p>
            <p className="text-xs text-muted-foreground">{row.target}</p>
          </div>
        ),
      },
      {
        key: "change",
        header: "System Changes",
        render: (row) => <ChangeDiff change={row.change} />,
      },
      {
        key: "detail",
        header: "Detail",
        render: () => (
          <button
            type="button"
            aria-label="View detail"
            className={cn(
              "grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted",
            )}
          >
            <ExternalLink className="size-4" />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      emptyMessage="No events match these filters."
    />
  );
}
