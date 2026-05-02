"use client";

import { useCallback, useMemo } from "react";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { useTranslations } from "next-intl";

function exportCSV(filename: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = row[h];
        const str = String(val ?? "");
        return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type ExperienceRevenueRow = {
  id: string;
  name: string;
  gross: number;
  organizer: number;
  village: number;
  platform: number;
  split: { organizer: number; village: number; platform: number };
};

export type PropertySummaryRow = {
  id: string;
  name: string;
  totalReservations: number;
  paidCount: number;
  pendingCount: number;
  cancelledCount: number;
  revenue: number;
};

export type ReservationHistoryRow = {
  id: string;
  guestName: string;
  guestEmail: string;
  accommodationName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
};

type Props = {
  experienceRows: ExperienceRevenueRow[];
  propertyRows: PropertySummaryRow[];
  reservationRows: ReservationHistoryRow[];
};

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  success: "bg-primary/10 text-primary",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-violet-100 text-violet-700",
};

const RESERVATION_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  checked_in: "bg-primary/10 text-primary",
  checked_out: "bg-surface-container text-on-surface/80",
  cancelled: "bg-red-100 text-red-700",
};

export function FinanceReportsTables({ experienceRows, propertyRows, reservationRows }: Props) {
  const t = useTranslations("financeReports");

  const handleExportExperience = useCallback(() => {
    exportCSV("experience-revenue.csv", experienceRows.map((r) => ({
      [t("table.experience")]: r.name,
      [t("table.gross")]: r.gross,
      [t("table.organizer")]: r.organizer,
      [t("table.village")]: r.village,
      [t("table.platform")]: r.platform,
      "Split (org/vil/pltf)":`${r.split.organizer}/${r.split.village}/${r.split.platform}`,
    })));
  }, [experienceRows, t]);

  const handleExportProperties = useCallback(() => {
    exportCSV("property-summary.csv", propertyRows.map((r) => ({
      [t("table.accommodation")]: r.name,
      [t("table.reservation")]: r.totalReservations,
      [t("table.paid")]: r.paidCount,
      [t("table.pending")]: r.pendingCount,
      [t("table.cancelled")]: r.cancelledCount,
      [t("table.revenue")]: r.revenue,
    })));
  }, [propertyRows, t]);

  const handleExportReservations = useCallback(() => {
    exportCSV("reservation-history.csv", reservationRows.map((r) => ({
      ID: r.id,
      [t("table.guest")]: r.guestName,
      Email: r.guestEmail,
      [t("table.accommodation")]: r.accommodationName,
      [t("table.room")]: r.roomName,
      [t("table.checkIn")]: r.checkIn,
      [t("table.checkOut")]: r.checkOut,
      [t("table.amount")]: r.totalPrice,
      [t("table.payment")]: r.paymentStatus,
      [t("table.status")]: r.status,
    })));
  }, [reservationRows, t]);

  const expColumns = useMemo((): ColumnDef<ExperienceRevenueRow>[] => [
    { id: "name", header: t("table.experience"), accessorKey: "name", sortable: true },
    {
      id: "split",
      header: t("table.split"),
      accessorKey: "gross",
      hideOnMobile: true,
      accessorFn: (row) => (
        <span className="text-xs text-on-surface/70">{row.split.organizer}/{row.split.village}/{row.split.platform}</span>
      ),
    },
    {
      id: "gross",
      header: t("table.gross"),
      accessorKey: "gross",
      sortable: true,
      accessorFn: (row) => <span className="text-on-surface/80">{formatCurrency(row.gross)}</span>,
    },
    {
      id: "organizer",
      header: t("table.organizer"),
      accessorKey: "organizer",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-primary">{formatCurrency(row.organizer)}</span>,
    },
    {
      id: "village",
      header: t("table.village"),
      accessorKey: "village",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-blue-700">{formatCurrency(row.village)}</span>,
    },
    {
      id: "platform",
      header: t("table.platform"),
      accessorKey: "platform",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-violet-700">{formatCurrency(row.platform)}</span>,
    },
  ], [t]);

  const propColumns = useMemo((): ColumnDef<PropertySummaryRow>[] => [
    { id: "name", header: t("table.accommodation"), accessorKey: "name", sortable: true },
    { id: "totalReservations", header: t("table.reservation"), accessorKey: "totalReservations", sortable: true, hideOnMobile: true },
    {
      id: "paidCount",
      header: t("table.paid"),
      accessorKey: "paidCount",
      sortable: true,
      accessorFn: (row) => <span className="font-medium text-primary">{row.paidCount}</span>,
    },
    {
      id: "pendingCount",
      header: t("table.pending"),
      accessorKey: "pendingCount",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-amber-600">{row.pendingCount}</span>,
    },
    {
      id: "cancelledCount",
      header: t("table.cancelled"),
      accessorKey: "cancelledCount",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-red-600">{row.cancelledCount}</span>,
    },
    {
      id: "revenue",
      header: t("table.revenue"),
      accessorKey: "revenue",
      sortable: true,
      accessorFn: (row) => <span className="font-semibold text-on-surface">{formatCurrency(row.revenue)}</span>,
    },
  ], [t]);

  const resColumns = useMemo((): ColumnDef<ReservationHistoryRow>[] => [
    {
      id: "id",
      header: t("table.id"),
      accessorKey: "id",
      hideOnMobile: true,
      accessorFn: (row) => <span className="font-mono text-xs text-on-surface/40">{row.id}</span>,
    },
    {
      id: "guestName",
      header: t("table.guest"),
      accessorKey: "guestName",
      sortable: true,
      accessorFn: (row) => (
        <div>
          <p className="font-medium text-on-surface">{row.guestName}</p>
          <p className="text-xs text-on-surface/40">{row.guestEmail}</p>
        </div>
      ),
    },
    {
      id: "accommodationName",
      header: t("table.accommodation"),
      accessorKey: "accommodationName",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-xs text-on-surface/70">{row.accommodationName}</span>,
    },
    {
      id: "roomName",
      header: t("table.room"),
      accessorKey: "roomName",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="text-xs text-on-surface/70">{row.roomName}</span>,
    },
    {
      id: "checkIn",
      header: t("table.checkIn"),
      accessorKey: "checkIn",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="whitespace-nowrap text-xs text-on-surface/60">{formatDateShort(row.checkIn)}</span>,
    },
    {
      id: "checkOut",
      header: t("table.checkOut"),
      accessorKey: "checkOut",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (row) => <span className="whitespace-nowrap text-xs text-on-surface/60">{formatDateShort(row.checkOut)}</span>,
    },
    {
      id: "totalPrice",
      header: t("table.amount"),
      accessorKey: "totalPrice",
      sortable: true,
      accessorFn: (row) => <span className="whitespace-nowrap font-semibold text-on-surface">{formatCurrency(row.totalPrice)}</span>,
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
    {
      id: "status",
      header: t("table.status"),
      accessorKey: "status",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("reservationStatus.pending"), value: "pending" },
        { label: t("reservationStatus.confirmed"), value: "confirmed" },
        { label: t("reservationStatus.checked_in"), value: "checked_in" },
        { label: t("reservationStatus.checked_out"), value: "checked_out" },
        { label: t("reservationStatus.cancelled"), value: "cancelled" },
      ],
      accessorFn: (row) => (
        <Badge className={RESERVATION_STATUS_CLASS[row.status] ?? ""}>
          {t(`reservationStatus.${row.status}`)}
        </Badge>
      ),
    },
  ], [t]);

  return (
    <>
      {/* Experience Revenue Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t("experienceShare.title")}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportExperience} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {t("export.csv")}
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={experienceRows}
            columns={expColumns}
            keyExtractor={(r) => r.id}
            searchableFields={["name"]}
            searchPlaceholder="Cari experience..."
            pageSize={10}
            emptyState={{ title: "Tidak ada data" }}
          />
        </CardContent>
      </Card>

      {/* Property Summary Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t("propertySummary.title")}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportProperties} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {t("export.csv")}
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={propertyRows}
            columns={propColumns}
            keyExtractor={(r) => r.id}
            searchableFields={["name"]}
            searchPlaceholder="Cari properti..."
            pageSize={10}
            emptyState={{ title: "Tidak ada data" }}
          />
        </CardContent>
      </Card>

      {/* Reservation History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t("reservationHistory.title")}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportReservations} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {t("export.csv")}
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={reservationRows}
            columns={resColumns}
            keyExtractor={(r) => r.id}
            searchableFields={["guestName", "guestEmail", "accommodationName"]}
            searchPlaceholder="Cari transaksi..."
            pageSize={10}
            emptyState={{ title: "Tidak ada transaksi" }}
          />
        </CardContent>
      </Card>
    </>
  );
}
