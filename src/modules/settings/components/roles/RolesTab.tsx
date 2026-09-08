"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangeLogPanel } from "@/modules/settings/components/roles/ChangeLogPanel";
import { CreateRoleModal } from "@/modules/settings/components/roles/CreateRoleModal";
import { RoleList } from "@/modules/settings/components/roles/RoleList";
import { RoleMatrixEditor } from "@/modules/settings/components/roles/RoleMatrixEditor";
import { RolesStatsRow } from "@/modules/settings/components/roles/RolesStatsRow";
import {
  useRoleMatrix,
  useRoles,
} from "@/modules/settings/controllers/settingsController";

export function RolesTab() {
  const [pickedId, setPickedId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const { data: roles, isFetching: rolesFetching } = useRoles();

  const activeId =
    pickedId && roles?.some((role) => role.id === pickedId)
      ? pickedId
      : (roles?.[0]?.id ?? null);

  const { data: roleDetail, isLoading: detailLoading } =
    useRoleMatrix(activeId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Your created roles &amp; permission below
          </h2>
          <p className="text-sm text-muted-foreground">
            Define granular access control for your team.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Create New Role
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <RoleList
          roles={roles}
          isLoading={rolesFetching}
          selectedId={activeId}
          onSelect={setPickedId}
        />

        <Card className="p-5">
          {detailLoading || !roleDetail ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <RoleMatrixEditor
              key={roleDetail.id}
              role={roleDetail}
              onSaved={() => undefined}
            />
          )}
        </Card>
      </div>

      <ChangeLogPanel />
      <RolesStatsRow />

      <CreateRoleModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
