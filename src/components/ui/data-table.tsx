"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./search-input";
import { Pagination } from "./pagination";
import { EmptyState } from "./empty-state";
import { Skeleton } from "./skeleton";
import { DropdownMenu, type DropdownMenuItem } from "./dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";

// Column Definition
export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  className?: string;
  hideOnMobile?: boolean;
}

// Action Item
export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

// Props
export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];
  // Search
  searchPlaceholder?: string;
  searchableFields?: (keyof T)[];
  // Actions
  actions?: (row: T) => ActionItem[];
  // States
  isLoading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
  };
  // Mobile card renderer
  mobileCardRenderer?: (row: T, actions?: ActionItem[]) => React.ReactNode;
  // Toolbar extras
  toolbarExtra?: React.ReactNode;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  searchPlaceholder = "Search...",
  searchableFields,
  actions,
  isLoading = false,
  emptyState,
  mobileCardRenderer,
  toolbarExtra,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [sortCol, setSortCol] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter logic
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Search
    if (search && searchableFields) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        searchableFields.some((field) => {
          const val = row[field];
          return val != null && String(val).toLowerCase().includes(lower);
        })
      );
    }

    // Column Filters
    Object.entries(filters).forEach(([colId, values]) => {
      if (values.length === 0) return;
      const col = columns.find((c) => c.id === colId);
      if (!col || !col.accessorKey) return;
      result = result.filter((row) => {
        const val = String(row[col.accessorKey!] ?? "");
        return values.includes(val);
      });
    });

    // Sort
    if (sortCol && sortDir) {
      const col = columns.find((c) => c.id === sortCol);
      if (col && col.accessorKey) {
        result.sort((a, b) => {
          const aVal = a[col.accessorKey!];
          const bVal = b[col.accessorKey!];
          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return 1;
          if (bVal == null) return -1;
          const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }

    return result;
  }, [data, search, searchableFields, filters, columns, sortCol, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, pageSize]);

  const handleSort = (colId: string) => {
    if (sortCol === colId) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortCol(null);
        setSortDir(null);
      }
    } else {
      setSortCol(colId);
      setSortDir("asc");
    }
  };

  const activeFilterCount = Object.values(filters).reduce((acc, v) => acc + v.length, 0);
  const filterableColumns = columns.filter((c) => c.filterable && c.filterOptions);

  const getCellValue = (row: T, col: ColumnDef<T>) => {
    if (col.accessorFn) return col.accessorFn(row);
    if (col.accessorKey) return String(row[col.accessorKey] ?? "");
    return "";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-lg border border-stone-200 overflow-hidden">
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-stone-100 px-4 py-3">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
            className="w-full sm:max-w-xs"
          />
          {filterableColumns.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors",
                activeFilterCount > 0
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-stone-300 text-stone-600 hover:bg-stone-50"
              )}
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>
        {toolbarExtra}
      </div>

      {/* Filter panel */}
      {showFilters && filterableColumns.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="flex flex-wrap gap-4">
            {filterableColumns.map((col) => (
              <div key={col.id} className="space-y-1.5">
                <p className="text-xs font-medium text-stone-600">{col.header}</p>
                <div className="flex flex-wrap gap-1.5">
                  {col.filterOptions!.map((opt) => {
                    const active = (filters[col.id] || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => {
                            const current = prev[col.id] || [];
                            return {
                              ...prev,
                              [col.id]: active
                                ? current.filter((v) => v !== opt.value)
                                : [...current, opt.value],
                            };
                          });
                        }}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                          active
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-stone-300 text-stone-600 hover:border-emerald-400"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters({})}
              className="mt-3 inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 transition-colors"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {filteredData.length === 0 && emptyState ? (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-lg border border-stone-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className={cn(
                          "px-4 py-3 text-left font-medium text-stone-600",
                          col.hideOnMobile && "hidden lg:table-cell",
                          col.sortable && "cursor-pointer select-none hover:text-stone-900",
                          col.className
                        )}
                        onClick={col.sortable ? () => handleSort(col.id) : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.header}
                          {col.sortable && (
                            <span className="text-stone-400">
                              {sortCol === col.id ? (
                                sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="h-3.5 w-3.5" />
                              )}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                    {actions && <th className="w-12 px-4 py-3" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paginatedData.map((row) => (
                    <tr key={keyExtractor(row)} className="hover:bg-stone-50/50 transition-colors">
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={cn(
                            "px-4 py-3 text-stone-700",
                            col.hideOnMobile && "hidden lg:table-cell",
                            col.className
                          )}
                        >
                          {getCellValue(row, col)}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3">
                          <DropdownMenu items={actions(row) as DropdownMenuItem[]} align="right" />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {paginatedData.map((row) => {
              const rowActions = actions?.(row);
              if (mobileCardRenderer) {
                return (
                  <div key={keyExtractor(row)}>
                    {mobileCardRenderer(row, rowActions)}
                  </div>
                );
              }
              return (
                <div
                  key={keyExtractor(row)}
                  className="rounded-lg border border-stone-200 bg-white p-4 space-y-2"
                >
                  {columns.map((col) => (
                    <div key={col.id} className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-stone-500">{col.header}</span>
                      <span className="text-sm text-stone-700 text-right truncate max-w-[60%]">
                        {getCellValue(row, col)}
                      </span>
                    </div>
                  ))}
                  {rowActions && rowActions.length > 0 && (
                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                      {rowActions.map((action, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className={cn(
                            "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                            action.variant === "destructive"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                          )}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onPageSizeChange={setPageSize}
              totalItems={filteredData.length}
            />
          )}
        </>
      )}
    </div>
  );
}
