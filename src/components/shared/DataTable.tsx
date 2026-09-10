"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<Row> {
  key: string;
  header: string;
  width?: string;
  className?: string;
  render?: (row: Row) => React.ReactNode;
}

export interface RowAction<Row> {
  label: string;
  onSelect: (row: Row) => void;
  /** Per-row disable — used for self-action guards and permission gating. */
  disabled?: (row: Row) => boolean;
  variant?: "default" | "destructive";
  /**
   * Required when `rowActionsVariant="inline"`; ignored by the menu variant.
   * Any icon component that accepts `className` — a `lucide-react` icon or a
   * project SVG icon from `@/components/icons/*`.
   */
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableProps<Row> {
  columns: Column<Row>[];
  data: Row[] | undefined;
  getRowId: (row: Row) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  rowActions?: RowAction<Row>[];
  /**
   * `"menu"` (default) renders the `⋮` dropdown. `"inline"` renders each action
   * as an icon button in the cell — the Figma list-page pattern (edit / delete).
   */
  rowActionsVariant?: "menu" | "inline";
  onRowClick?: (row: Row) => void;
}

/**
 * The canonical table primitive. Owns its own loading / empty rendering and the
 * row `⋮` menu. Does NOT own pagination, search, or filtering — compose
 * <DataTableToolbar> and <TablePagination> around it. Memoised because it
 * renders on nearly every screen.
 */
function DataTableInner<Row>({
  columns,
  data,
  getRowId,
  isLoading,
  emptyMessage = "Nothing to show yet.",
  rowActions,
  rowActionsVariant = "menu",
  onRowClick,
}: DataTableProps<Row>) {
  const colCount = columns.length + (rowActions?.length ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className="px-4 py-3 font-medium text-text-secondary"
              >
                {column.header}
              </th>
            ))}
            {rowActions?.length ? (
              <th className="w-12 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr
                key={`skeleton-${rowIndex}`}
                className="border-b border-border"
              >
                {Array.from({ length: colCount }).map((__, cellIndex) => (
                  <td
                    key={`skeleton-${rowIndex}-${cellIndex}`}
                    className="px-4 py-3"
                  >
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : !data || data.length === 0 ? (
            <tr>
              <td
                colSpan={colCount}
                className="px-4 py-12 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = getRowId(row);
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    onRowClick && "cursor-pointer hover:bg-muted/40",
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={`${id}-${column.key}`}
                      className={cn(
                        "px-4 py-3 text-foreground tracking-tight",
                        column.className,
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            (row as Record<string, unknown>)[column.key] ?? "—",
                          )}
                    </td>
                  ))}
                  {rowActions?.length ? (
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActionsVariant === "inline" ? (
                        <div className="flex items-center justify-end gap-1">
                          {rowActions.map((action) => {
                            const Icon = action.icon ?? MoreVertical;
                            return (
                              <button
                                key={action.label}
                                type="button"
                                aria-label={action.label}
                                title={action.label}
                                disabled={action.disabled?.(row)}
                                onClick={() => action.onSelect(row)}
                                className={cn(
                                  "grid size-8 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
                                  action.variant === "destructive" &&
                                    "hover:bg-destructive-subtle hover:text-destructive",
                                )}
                              >
                                <Icon className="size-4" />
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label="Row actions"
                            className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <MoreVertical className="size-4 text-info" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map((action) => (
                              <DropdownMenuItem
                                key={action.label}
                                variant={action.variant}
                                disabled={action.disabled?.(row)}
                                onSelect={() => action.onSelect(row)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = React.memo(DataTableInner) as typeof DataTableInner;
