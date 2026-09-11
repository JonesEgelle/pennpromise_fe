"use client";

import * as React from "react";

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
      <Card className="overflow-hidden rounded-[15px] shadow-none">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">
              Roles &amp; Permissions
            </h2>
            <p className="text-sm text-muted-foreground">
              Define granular access control for your team.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[18px] font-bold text-foreground">
            Your created roles &amp; permission below
          </h3>
          <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
            Create New Role
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <RoleList
          roles={roles}
          isLoading={rolesFetching}
          selectedId={activeId}
          onSelect={setPickedId}
        />

        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[15px] shadow-none border-none">
            {detailLoading || !roleDetail ? (
              <div className="space-y-4 p-5">
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

          <ChangeLogPanel />
          <RolesStatsRow />
        </div>
      </div>

      <CreateRoleModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
