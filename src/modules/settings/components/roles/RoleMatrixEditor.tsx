"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { PermissionMatrix } from "@/modules/settings/components/roles/PermissionMatrix";
import { useSaveRoleMatrix } from "@/modules/settings/controllers/settingsController";
import type { PermissionColumn, RoleDetail } from "@/modules/settings/types";

interface RoleMatrixEditorProps {
  role: RoleDetail;
  onSaved: () => void;
}

/** Mounted with `key={role.id}` so the draft re-seeds per role — no effect. */
export function RoleMatrixEditor({ role, onSaved }: RoleMatrixEditorProps) {
  const [matrix, setMatrix] = React.useState(role.matrix);
  const save = useSaveRoleMatrix();

  const dirty = JSON.stringify(matrix) !== JSON.stringify(role.matrix);
  const activeCount = matrix.reduce(
    (total, row) =>
      total +
      Number(row.view) +
      Number(row.create) +
      Number(row.edit) +
      Number(row.delete) +
      Number(row.export),
    0,
  );

  const toggle = (module: string, column: PermissionColumn, value: boolean) => {
    setMatrix((current) =>
      current.map((row) =>
        row.module === module ? { ...row, [column]: value } : row,
      ),
    );
  };

  const onSave = () => {
    save.mutate(
      { id: role.id, matrix, version: role.version },
      { onSuccess: onSaved },
    );
  };

  return (
    <div>
      <div className="bg-surface-muted p-5">
        <h3 className="text-base font-semibold text-foreground">
          {role.name} Permissions
        </h3>
        <p className="text-sm text-muted-foreground">
          Configuring {activeCount} active permissions across {matrix.length}{" "}
          Sharia-specific modules.
        </p>
      </div>

      <div className="space-y-4">
        <PermissionMatrix
          matrix={matrix}
          onToggle={toggle}
          disabled={save.isPending}
        />

        <div className="flex justify-end gap-2 p-5">
          <Button
            variant="outline"
            size="sm"
            disabled={!dirty || save.isPending}
            onClick={() => setMatrix(role.matrix)}
          >
            Discard
          </Button>
          <Button
            size="sm"
            isLoading={save.isPending}
            disabled={!dirty}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
