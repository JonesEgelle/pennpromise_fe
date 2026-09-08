"use client";

import * as React from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  type Column,
  type RowAction,
} from "@/components/shared/DataTable";
import { DataTableToolbar } from "@/components/shared/DataTableToolbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { AdminUserFormModal } from "@/modules/settings/components/userManagement/AdminUserFormModal";
import { DeleteAdminUserDialog } from "@/modules/settings/components/userManagement/DeleteAdminUserDialog";
import { useAdminUsers } from "@/modules/settings/controllers/settingsController";
import { ADMIN_STATUS_OPTIONS } from "@/modules/settings/lib/validators";
import type { AdminUser } from "@/modules/settings/types";

const STATUS_FILTER = [
  { value: "all", label: "All Status" },
  ...ADMIN_STATUS_OPTIONS,
];

export function UserManagementTab() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const [status, setStatus] =
    React.useState<AdminUser["status"] | "all">("all");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminUser | null>(null);
  const [deleting, setDeleting] = React.useState<AdminUser | null>(null);

  const search = useDebounce(searchInput);
  const { data, isFetching } = useAdminUsers({ page, pageSize, search, status });

  const rows = data?.results ?? [];
  const adminCountOnPage = rows.filter(
    (row) => row.role === "Administrator",
  ).length;

  const columns = React.useMemo<Column<AdminUser>[]>(
    () => [
      { key: "name", header: "Name" },
      {
        key: "email",
        header: "Email Address",
        render: (row) => (
          <span className="text-text-secondary">{row.email}</span>
        ),
      },
      {
        key: "role",
        header: "Role",
        render: (row) => <Badge variant="default">{row.role}</Badge>,
      },
      { key: "department", header: "Department" },
      {
        key: "lastLoginAt",
        header: "Last Login",
        render: (row) => formatDate(row.lastLoginAt, "datetime"),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [],
  );

  const rowActions = React.useMemo<RowAction<AdminUser>[]>(
    () => [
      {
        label: "Edit operator",
        icon: Pencil,
        onSelect: (row) => setEditing(row),
      },
      {
        label: "Remove operator",
        icon: Trash2,
        variant: "destructive",
        // Self-action double guard (disable + the mutation re-checks).
        disabled: (row) =>
          row.isSelf || (row.role === "Administrator" && adminCountOnPage <= 1),
        onSelect: (row) => setDeleting(row),
      },
    ],
    [adminCountOnPage],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          User Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Add, edit, and manage staff accounts across your dashboard.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Users/Staffs Informations
          </h3>
          <DataTableToolbar
            search={searchInput}
            onSearchChange={(value) => {
              setSearchInput(value);
              setPage(1);
            }}
            searchPlaceholder="Search operators…"
          >
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as AdminUser["status"] | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <UserPlus className="size-4" />
              Add New User
            </Button>
          </DataTableToolbar>
        </div>

        <DataTable
          columns={columns}
          data={data?.results}
          getRowId={(row) => row.id}
          isLoading={isFetching && !data}
          emptyMessage="No operators found."
          rowActions={rowActions}
          rowActionsVariant="inline"
          onRowClick={(row) => setEditing(row)}
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

      <AdminUserFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <AdminUserFormModal
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        adminUser={editing}
      />
      <DeleteAdminUserDialog
        adminUser={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </div>
  );
}
