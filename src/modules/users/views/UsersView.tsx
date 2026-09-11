"use client";

import * as React from "react";
import { Eye, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BinIcon,
  CalendarIcon,
  EditIcon,
  ExportIcon,
} from "@/components/icons/action-icons";
import {
  DataTable,
  type Column,
  type RowAction,
} from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { DeleteMemberDialog } from "@/modules/users/components/DeleteMemberDialog";
import { MemberDetailModal } from "@/modules/users/components/MemberDetailModal";
import { MemberFormModal } from "@/modules/users/components/MemberFormModal";
import { useMembers } from "@/modules/users/controllers/usersController";
import { MEMBER_STATUS_OPTIONS } from "@/modules/users/lib/validators";
import type { Member, MemberListParams } from "@/modules/users/types";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  ...MEMBER_STATUS_OPTIONS,
];

export function UsersView() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const [status, setStatus] = React.useState<MemberListParams["status"]>("all");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Member | null>(null);
  const [deleting, setDeleting] = React.useState<Member | null>(null);
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const search = useDebounce(searchInput);
  const params: MemberListParams = {
    page,
    pageSize,
    search,
    status,
    certification: "all",
  };
  const { data, isFetching } = useMembers(params);

  const columns = React.useMemo<Column<Member>[]>(
    () => [
      { key: "memberId", header: "Member ID", width: "120px" },
      {
        key: "name",
        header: "Member Name",
        render: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        key: "email",
        header: "Email Address",
        render: (row) => (
          <span className="text-text-secondary">{row.email}</span>
        ),
      },
      {
        key: "certification",
        header: "Department",
        render: (row) => <StatusBadge status={row.certification} />,
      },
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

  const rowActions = React.useMemo<RowAction<Member>[]>(
    () => [
      {
        label: "View member",
        icon: Eye,
        onSelect: (row) => setDetailId(row.memberId),
      },
      {
        label: "Edit member",
        icon: EditIcon,
        onSelect: (row) => setEditing(row),
      },
      {
        label: "Remove member",
        icon: BinIcon,
        variant: "destructive",
        onSelect: (row) => setDeleting(row),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage members, certify compliance, and monitor Sharia-compliant portfolios."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <CalendarIcon className="size-4" />
              Invite Member
            </Button>
            {/* TODO(api-contract): export job with the active filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Export started.")}
            >
              <ExportIcon className="size-4" />
              Export CSV
            </Button>
          </>
        }
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Users/Staffs Informations
          </h2>
          {/* Search · All Status · Add New User — single aligned row (see Figma). */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                  setPage(1);
                }}
                placeholder="Search members…"
                aria-label="Search members"
                className="pl-9 shadow-none"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as MemberListParams["status"]);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-40 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((option) => (
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
          getRowId={(row) => row.memberId}
          isLoading={isFetching && !data}
          emptyMessage="No members found."
          rowActions={rowActions}
          rowActionsVariant="inline"
          onRowClick={(row) => setDetailId(row.memberId)}
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

      <MemberFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <MemberFormModal
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        member={editing}
      />
      <DeleteMemberDialog
        member={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
      <MemberDetailModal
        memberId={detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
      />
    </div>
  );
}
