"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BinIcon, EditIcon } from "@/components/icons/action-icons";
import {
  DataTable,
  type Column,
  type RowAction,
} from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { AdminUserFormModal } from "@/modules/settings/components/userManagement/AdminUserFormModal";
import { DeleteAdminUserDialog } from "@/modules/settings/components/userManagement/DeleteAdminUserDialog";
import { SettingsSection } from "@/modules/settings/components/SettingsSection";
import { useAdminUsers } from "@/modules/settings/controllers/settingsController";
import { ADMIN_STATUS_OPTIONS } from "@/modules/settings/lib/validators";
import type { AdminUser } from "@/modules/settings/types";

const STATUS_FILTER = [
  { value: "all", label: "All Status" },
  ...ADMIN_STATUS_OPTIONS,
];

const STATUS_BADGE: Record<AdminUser["status"], string> = {
  active: "border-transparent bg-success-subtle text-success",
  suspended: "border-transparent bg-primary/10 text-primary",
  invited: "border-transparent bg-warning-subtle text-warning",
};

export function UserManagementTab() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const [status, setStatus] = React.useState<AdminUser["status"] | "all">(
    "all",
  );

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminUser | null>(null);
  const [deleting, setDeleting] = React.useState<AdminUser | null>(null);

  const search = useDebounce(searchInput);
  const { data, isFetching } = useAdminUsers({ page, pageSize, search, status });

  const rows = data?.results ?? [];
  const adminCountOnPage = rows.filter(
    (row) => row.role === "Administrator",
  ).length;

  const resetFilters = () => {
    setSearchInput("");
    setStatus("all");
    setPage(1);
  };

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
        render: (row) => (
          <Badge className={`capitalize ${STATUS_BADGE[row.status]}`}>
            {row.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  const rowActions = React.useMemo<RowAction<AdminUser>[]>(
    () => [
      {
        label: "Edit operator",
        icon: EditIcon,
        onSelect: (row) => setEditing(row),
      },
      {
        label: "Remove operator",
        icon: BinIcon,
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
    <SettingsSection
      className="shadow-none"
      title="User Management"
      description="Add, edit, and manage staff accounts across your dashboard."
      actions={
        <>
          <Button variant="outline" onClick={resetFilters}>
            Cancel
          </Button>
          <Button onClick={() => toast.success("Changes saved.")}>Save</Button>
        </>
      }
    >
      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Users/Staffs Informations
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                  setPage(1);
                }}
                placeholder="Search operators…"
                aria-label="Search operators"
                className="pl-9 shadow-none"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as AdminUser["status"] | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="shadow-none sm:w-40">
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
            <Button onClick={() => setCreateOpen(true)}>Add New User</Button>
          </div>
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
    </SettingsSection>
  );
}
