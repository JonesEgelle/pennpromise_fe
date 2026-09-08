"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Paginator } from "@/types/http";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface TablePaginationProps {
  /** Server pagination metadata. Never compute pages on the client. */
  pagination: Paginator | undefined;
  onPageChange: (page: number) => void;
  /** Provide to render a rows-per-page selector (matches the Figma list pages). */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

/**
 * Build a compact page list with ellipses, e.g. `[1, "…", 4, 5, 6, "…", 24]`.
 * Always shows the first and last page plus a window around the current one.
 */
function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    total,
    current,
    current - 1,
    current + 1,
  ]);
  const ordered = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of ordered) {
    if (page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

export function TablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  isLoading,
}: TablePaginationProps) {
  if (!pagination) return null;

  const { page, total_pages, count, page_size } = pagination;
  const totalPages = Math.max(total_pages, 1);
  const from = count === 0 ? 0 : (page - 1) * page_size + 1;
  const to = Math.min(page * page_size, count);
  const pageList = buildPageList(page, totalPages);

  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {count === 0 ? "No results" : `Showing ${from}–${to} of ${count}`}
        </p>
        {onPageSizeChange ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows</span>
            <Select
              value={String(page_size)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[4.5rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pageList.map((entry, index) =>
          entry === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={entry}
              variant={entry === page ? "default" : "outline"}
              size="sm"
              className={cn("min-w-9", entry === page && "pointer-events-none")}
              disabled={isLoading}
              aria-current={entry === page ? "page" : undefined}
              onClick={() => onPageChange(entry)}
            >
              {entry}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
