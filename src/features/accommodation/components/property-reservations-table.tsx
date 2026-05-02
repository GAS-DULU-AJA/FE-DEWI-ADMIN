"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { Reservation } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const RESERVATION_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Checked In", className: "bg-primary/10 text-primary" },
  checked_out: { label: "Completed", className: "bg-surface-container text-on-surface/80" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  success: { label: "Paid", className: "bg-primary/10 text-primary" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", className: "bg-violet-100 text-violet-700" },
};

const columns: ColumnDef<Reservation>[] = [
  {
    id: "guest",
    header: "Guest",
    accessorFn: (row) => (
      <div>
        <p className="font-medium text-on-surface">{row.guestName}</p>
        <p className="text-xs text-on-surface/60">{row.guestEmail}</p>
      </div>
    ),
    sortable: true,
  },
  {
    id: "room",
    header: "Room",
    accessorKey: "roomName",
    sortable: true,
  },
  {
    id: "checkIn",
    header: "Check-In",
    accessorFn: (row) => formatDateShort(row.checkIn),
    sortable: true,
  },
  {
    id: "checkOut",
    header: "Check-Out",
    accessorFn: (row) => formatDateShort(row.checkOut),
    sortable: true,
    hideOnMobile: true,
  },
  {
    id: "total",
    header: "Total",
    accessorFn: (row) => formatCurrency(row.totalPrice),
    sortable: true,
  },
  {
    id: "status",
    header: "Reservation Status",
    accessorKey: "status",
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "checked_in", label: "Checked In" },
      { value: "checked_out", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    accessorFn: (row) => (
      <Badge className={RESERVATION_STATUS_META[row.status]?.className ?? "bg-surface-container text-on-surface/80"}>
        {RESERVATION_STATUS_META[row.status]?.label ?? row.status}
      </Badge>
    ),
  },
  {
    id: "paymentStatus",
    header: "Payment",
    accessorKey: "paymentStatus",
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: "pending", label: "Pending" },
      { value: "success", label: "Paid" },
      { value: "failed", label: "Failed" },
      { value: "refunded", label: "Refunded" },
    ],
    accessorFn: (row) => (
      <Badge className={PAYMENT_STATUS_META[row.paymentStatus]?.className ?? "bg-surface-container text-on-surface/80"}>
        {PAYMENT_STATUS_META[row.paymentStatus]?.label ?? row.paymentStatus}
      </Badge>
    ),
  },
];

export function PropertyReservationsTable({ reservations }: { reservations: Reservation[] }) {
  return (
    <DataTable
      data={reservations}
      columns={columns}
      keyExtractor={(row) => row.id}
      searchableFields={["guestName", "guestEmail", "roomName", "status", "paymentStatus"]}
      searchPlaceholder="Search reservations..."
      pageSize={10}
      emptyState={{
        title: "Belum ada reservasi untuk properti ini.",
      }}
    />
  );
}
