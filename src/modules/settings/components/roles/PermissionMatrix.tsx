"use client";

import { ShieldCheck } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { PermissionColumn, PermissionRow } from "@/modules/settings/types";

const COLUMNS: { key: PermissionColumn; label: string; tone: string }[] = [
  {
    key: "view",
    label: "View",
    tone: "data-[state=checked]:border-success data-[state=checked]:bg-card data-[state=checked]:text-success",
  },
  {
    key: "create",
    label: "Create",
    tone: "data-[state=checked]:border-destructive data-[state=checked]:bg-card data-[state=checked]:text-destructive",
  },
  {
    key: "edit",
    label: "Edit",
    tone: "data-[state=checked]:border-success data-[state=checked]:bg-card data-[state=checked]:text-success",
  },
  {
    key: "delete",
    label: "Delete",
    tone: "data-[state=checked]:border-success data-[state=checked]:bg-card data-[state=checked]:text-success",
  },
  {
    key: "export",
    label: "Export",
    tone: "data-[state=checked]:border-success data-[state=checked]:bg-card data-[state=checked]:text-success",
  },
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left text-[14px] text-muted-foreground">
            <th className="px-4 py-3 font-medium">Halal Module</th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                className="px-3 py-3 text-center font-medium"
              >
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Sharia MFA</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr
              key={row.module}
              className="border-b border-border last:border-b-0"
            >
              <td className="px-4 py-4 font-semibold text-foreground">
                {row.module}
              </td>
              {COLUMNS.map((column) => (
                <td key={column.key} className="px-3 py-4 text-center">
                  <Checkbox
                    checked={row[column.key]}
                    disabled={disabled}
                    onCheckedChange={(value) =>
                      onToggle(row.module, column.key, value === true)
                    }
                    className={cn(
                      "mx-auto rounded-[1px] shadow-none",
                      column.tone,
                    )}
                    aria-label={`${row.module} — ${column.label}`}
                  />
                </td>
              ))}
              <td className="px-4 py-4 text-right">
                {row.shariaMfa === "mandatory" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 p-2.5 text-xs font-medium text-primary">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    Mandatory
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-muted p-2.5 text-xs font-medium text-muted-foreground">
                    Optional
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
