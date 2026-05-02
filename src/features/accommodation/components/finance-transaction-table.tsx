"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Reservation } from "@/types";

type FinanceTransactionTableProps = {
  reservations: Reservation[];
  getAccommodationName: (id: string) => string;
};

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  success: "bg-primary/10 text-primary",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-violet-100 text-violet-700",
};

export function FinanceTransactionTable({ reservations, getAccommodationName }: FinanceTransactionTableProps) {
  const t = useTranslations("financeManagement");

  const columns = useMemo((): ColumnDef<Reservation>[] => [
    {
      id: "id",
      header: t("table.id"),
      accessorKey: "id",
      hideOnMobile: true,
      accessorFn: (row) => (
        <span className="font-mono text-xs text-on-surface/40">{row.id}</span>
      ),
    },
    {
      id: "createdAt",
      header: t("table.date"),
      accessorKey: "createdAt",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => (
        <span className="text-xs text-on-surface/60">{formatDateShort(row.createdAt)}</span>
      ),
    },
    {
      id: "guestName",
      header: t("table.guest"),
      accessorKey: "guestName",
      sortable: true,
    },
    {
      id: "accommodationId",
      header: t("table.accommodation"),
      accessorKey: "accommodationId",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => (
        <span className="text-xs text-on-surface/70">{getAccommodationName(row.accommodationId)}</span>
      ),
    },
    {
      id: "totalPrice",
      header: t("table.amount"),
      accessorKey: "totalPrice",
      sortable: true,
      accessorFn: (row) => (
        <span className="font-medium text-on-surface">{formatCurrency(row.totalPrice)}</span>
      ),
    },
    {
      id: "paymentStatus",
      header: t("table.payment"),
      accessorKey: "paymentStatus",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("paymentStatus.pending"), value: "pending" },
        { label: t("paymentStatus.success"), value: "success" },
        { label: t("paymentStatus.failed"), value: "failed" },
        { label: t("paymentStatus.refunded"), value: "refunded" },
      ],
      accessorFn: (row) => (
        <Badge className={PAYMENT_STATUS_CLASS[row.paymentStatus] ?? ""}>
          {t(`paymentStatus.${row.paymentStatus}`)}
        </Badge>
      ),
    },
  ], [t, getAccommodationName]);

  const mobileCardRenderer = (row: Reservation) => (
    <div className="space-y-1 p-1">
      <p className="font-semibold text-on-surface">{row.guestName}</p>
      <p className="text-xs text-on-surface/60">{getAccommodationName(row.accommodationId)}</p>
      <p className="text-xs font-medium text-on-surface/80">{formatCurrency(row.totalPrice)}</p>
      <Badge className={PAYMENT_STATUS_CLASS[row.paymentStatus] ?? ""}>
        {t(`paymentStatus.${row.paymentStatus}`)}
      </Badge>
    </div>
  );

  return (
    <DataTable
      data={reservations}
      columns={columns}
      keyExtractor={(r) => r.id}
      searchableFields={["guestName"]}
      searchPlaceholder="Cari transaksi..."
      pageSize={10}
      mobileCardRenderer={mobileCardRenderer}
      emptyState={{ title: "Tidak ada transaksi" }}
    />
  );
}
