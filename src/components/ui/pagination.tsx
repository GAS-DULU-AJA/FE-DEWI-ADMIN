"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  totalItems,
  className,
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-2 text-sm text-on-surface/60">
        {totalItems !== undefined && (
          <span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
        )}
        {pageSize && onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-surface-container-high bg-surface-container-lowest px-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-surface-container-high text-on-surface/70 transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getVisiblePages().map((page, idx) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-on-surface/40">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "inline-flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 text-sm transition-colors",
                page === currentPage
                  ? "bg-primary text-primary-foreground font-medium"
                  : "border border-surface-container-high text-on-surface/70 hover:bg-surface-container-low"
              )}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-surface-container-high text-on-surface/70 transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { Pagination };
export type { PaginationProps };
