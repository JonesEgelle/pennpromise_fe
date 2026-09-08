"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  PermissionColumn,
  PermissionRow,
} from "@/modules/settings/types";

const COLUMNS: { key: PermissionColumn; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "export", label: "Export" },
];

interface PermissionMatrixProps {
  matrix: PermissionRow[];
  onToggle: (module: string, column: PermissionColumn, value: boolean) => void;
  disabled?: boolean;
}

export function PermissionMatrix({
  matrix,
  onToggle,
  disabled,
}: PermissionMatrixProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">
              Halal Module
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                className="px-3 py-3 text-center font-medium text-text-secondary"
              >
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium text-text-secondary">
              Sharia MFA
            </th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr
              key={row.module}
              className="border-b border-border last:border-b-0"
            >
              <td className="px-4 py-3 font-medium text-foreground">
                {row.module}
              </td>
              {COLUMNS.map((column) => (
                <td key={column.key} className="px-3 py-3 text-center">
                  <Checkbox
                    checked={row[column.key]}
                    disabled={disabled}
                    onCheckedChange={(value) =>
                      onToggle(row.module, column.key, value === true)
                    }
                    aria-label={`${row.module} — ${column.label}`}
                  />
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <Badge
                  variant={row.shariaMfa === "mandatory" ? "warning" : "default"}
                >
                  {row.shariaMfa === "mandatory" ? "Mandatory" : "Optional"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
