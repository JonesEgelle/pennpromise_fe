"use client";

import * as React from "react";
import { Download, Landmark, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type Column,
  type RowAction,
} from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatDate, formatNairaAmount } from "@/lib/utils";
import { DeleteTransactionDialog } from "@/modules/transactions/components/DeleteTransactionDialog";
import { TransactionFormModal } from "@/modules/transactions/components/TransactionFormModal";
import {
  TransactionFilters,
  type TransactionFilterState,
} from "@/modules/transactions/components/TransactionFilters";
import { useTransactions } from "@/modules/transactions/controllers/transactionsController";
import type {
  Transaction,
  TransactionListParams,
} from "@/modules/transactions/types";

const INITIAL_FILTERS: TransactionFilterState = {
  dateRange: "last_24_hours",
  compliance: "all",
  product: "all",
  client: "",
  amountMin: "",
  amountMax: "",
};

function toBound(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TransactionsView() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filters, setFilters] =
    React.useState<TransactionFilterState>(INITIAL_FILTERS);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | null>(null);
  const [deleting, setDeleting] = React.useState<Transaction | null>(null);

  const client = useDebounce(filters.client);
  const amountMin = useDebounce(filters.amountMin);
  const amountMax = useDebounce(filters.amountMax);

  const params: TransactionListParams = {
    page,
    pageSize,
    dateRange: filters.dateRange,
    compliance: filters.compliance,
    product: filters.product,
    client,
    amountMin: toBound(amountMin),
    amountMax: toBound(amountMax),
  };
  const { data, isFetching } = useTransactions(params);

  const onFilterChange = <K extends keyof TransactionFilterState>(
    key: K,
    next: TransactionFilterState[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: next }));
    setPage(1);
  };

  const columns = React.useMemo<Column<Transaction>[]>(
    () => [
      { key: "contractId", header: "Contract ID", width: "150px" },
      {
        key: "timestamp",
        header: "Timestamp",
        render: (row) => formatDate(row.timestamp, "datetime"),
      },
      {
        key: "client",
        header: "Client",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarFallback>{initials(row.client.name)}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="font-medium text-foreground">{row.client.name}</p>
              <p className="text-xs text-muted-foreground">
                BVN: {row.client.bvnMasked}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "product",
        header: "Product",
        render: (row) => (
          <span className="flex items-center gap-2 capitalize">
            <Landmark className="size-4 text-muted-foreground" aria-hidden />
            {row.product}
          </span>
        ),
      },
      {
        key: "amountNgn",
        header: "Amount",
        render: (row) => (
          <span className="font-medium text-foreground">
            {formatNairaAmount(row.amountNgn)}
          </span>
        ),
      },
      {
        key: "compliance",
        header: "Compliance",
        render: (row) => <StatusBadge status={row.compliance} />,
      },
    ],
    [],
  );

  const rowActions = React.useMemo<RowAction<Transaction>[]>(
    () => [
      {
        label: "Edit transaction",
        icon: Pencil,
        onSelect: (row) => setEditing(row),
      },
      {
        label: "Void transaction",
        icon: Trash2,
        variant: "destructive",
        onSelect: (row) => setDeleting(row),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Monitoring"
        description="Oversight of ethical and Sharia compliant assets flow across Nigeria."
        actions={
          <>
            {/* TODO(api-contract): export job with the active filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Export started.")}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add New Record
            </Button>
          </>
        }
      />

      <TransactionFilters value={filters} onChange={onFilterChange} />

      <section className={cn("space-y-4")}>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Transactions History
        </h2>
        <DataTable
          columns={columns}
          data={data?.results}
          getRowId={(row) => row.id}
          isLoading={isFetching && !data}
          emptyMessage="No transactions match these filters."
          rowActions={rowActions}
          rowActionsVariant="inline"
        />
        <TablePagination
          pagination={data?.pagination}
          onPageChange={setPage}
          onPageSizeChange={(next) => {
            setPageSize(next);
            setPage(1);
          }}
          isLoading={isFetching}
        />
      </section>

      <TransactionFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <TransactionFormModal
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        transaction={editing}
      />
      <DeleteTransactionDialog
        transaction={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </div>
  );
}
