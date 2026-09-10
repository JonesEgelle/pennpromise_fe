"use client";

import * as React from "react";
import { Ban } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLinkIcon } from "@/components/icons/action-icons";
import { FileTextIcon } from "@/components/icons/status-icons";
import {
  DataTable,
  type Column,
  type RowAction,
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
  const { field, old: oldValue, new: newValue } = change;

  // No prior value → a snapshot / note rather than a field diff.
  if (oldValue === null && newValue !== null) {
    const isSnapshot = field === "snapshot";
    return (
      <span
        className={cn(
          "flex items-start gap-2 rounded-[2px] p-4 text-xs",
          isSnapshot
            ? "bg-emerald-600/10 text-emerald-600"
            : "bg-muted text-text-secondary",
        )}
      >
        {isSnapshot ? (
          <FileTextIcon className="mt-0.5 size-3 shrink-0" aria-hidden />
        ) : null}
        <span>{newValue}</span>
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-stretch gap-2 text-xs">
      {oldValue !== null ? (
        <span className="rounded-[2px] bg-destructive-subtle p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-destructive">
            Old
          </span>
          <span className="block text-foreground">
            {field}: {oldValue}
          </span>
        </span>
      ) : null}
      {newValue !== null ? (
        <span className="rounded-[2px] bg-success-subtle p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-success">
            New
          </span>
          <span className="block text-foreground">
            {field}: {newValue}
          </span>
        </span>
      ) : (
        <span
          className="grid place-items-center rounded-[2px] bg-muted p-4 text-muted-foreground"
          aria-label="No new value"
        >
          <Ban className="size-4" aria-hidden />
        </span>
      )}
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
              <AvatarFallback className="font-bold">
                {initials(row.adminName)}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="font-bold text-foreground">{row.adminName}</p>
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
    ],
    [],
  );

  // Audit entries are immutable — the only row action is viewing the record.
  // TODO(api-contract): open an audit-detail drawer once the endpoint is defined.
  const rowActions = React.useMemo<RowAction<AuditEntry>[]>(
    () => [
      {
        label: "View detail",
        icon: ExternalLinkIcon,
        onSelect: () => toast.message("Audit detail view — coming soon."),
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
      rowActions={rowActions}
      rowActionsVariant="inline"
      className="border-none "
    />
  );
}
