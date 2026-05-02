"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import {
  getAllReservations,
} from "@/features/accommodation/utils";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ReservationStatusDonutChart,
  RevenueByPropertyChart,
} from "@/features/accommodation/components/dashboard-charts";
import { Eye } from "lucide-react";

type ReservationRow = ReturnType<typeof getAllReservations>[number];

const RESERVATION_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Aktif", className: "bg-primary/10 text-primary" },
  checked_out: { label: "Selesai", className: "bg-surface-container text-on-surface/80" },
  cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  success: { label: "Lunas", className: "bg-primary/10 text-primary" },
  failed: { label: "Gagal", className: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", className: "bg-violet-100 text-violet-700" },
};
export default function ReservasiPage() {
  const searchParams = useSearchParams();
  const presetAccommodationId = searchParams.get("accommodationId") ?? "all";
  const [selectedAccommodationId, setSelectedAccommodationId] = useState(presetAccommodationId);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled"
  >("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    "all" | "pending" | "success" | "failed" | "refunded"
  >("all");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(3000000);

  const reservations = getAllReservations();

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesAccommodation =
        selectedAccommodationId === "all" || reservation.accommodationId === selectedAccommodationId;
      const matchesStatus = selectedStatus === "all" || reservation.status === selectedStatus;
      const matchesPaymentStatus =
        selectedPaymentStatus === "all" || reservation.paymentStatus === selectedPaymentStatus;
      const matchesPrice = reservation.totalPrice >= priceMin && reservation.totalPrice <= priceMax;

      return matchesAccommodation && matchesStatus && matchesPaymentStatus && matchesPrice;
    });
  }, [reservations, selectedAccommodationId, selectedStatus, selectedPaymentStatus, priceMin, priceMax]);

  const summary = useMemo(() => {
    const totalValue = filteredReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
    return {
      total: filteredReservations.length,
      totalValue,
      active: filteredReservations.filter((item) => item.status === "pending" || item.status === "confirmed").length,
    };
  }, [filteredReservations]);

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Reservasi Penginapan"
        description="Data reservasi seluruh penginapan dengan filter berdasarkan penginapan, status, dan nilai transaksi."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: "Reservasi" },
        ]}
        backHref="/dashboard/accommodation"
      />

      {/* ── Mini chart overview ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">Status Reservasi</CardTitle>
            <p className="text-xs text-on-surface/40">Distribusi status seluruh booking</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ReservationStatusDonutChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">Pendapatan Per Properti</CardTitle>
            <p className="text-xs text-on-surface/40">Revenue lunas per penginapan</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <RevenueByPropertyChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Reservasi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">Penginapan</label>
            <select
              value={selectedAccommodationId}
              onChange={(event) => setSelectedAccommodationId(event.target.value)}
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            >
              <option value="all">Semua Penginapan</option>
              {ACCOMMODATIONS.map((accommodation) => (
                <option key={accommodation.id} value={accommodation.id}>
                  {accommodation.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">Status Reservasi</label>
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as
                    | "all"
                    | "pending"
                    | "confirmed"
                    | "checked_in"
                    | "checked_out"
                    | "cancelled"
                )
              }
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">Status Pembayaran</label>
            <select
              value={selectedPaymentStatus}
              onChange={(event) =>
                setSelectedPaymentStatus(
                  event.target.value as "all" | "pending" | "success" | "failed" | "refunded"
                )
              }
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            >
              <option value="all">Semua Pembayaran</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">Harga Minimum</label>
            <input
              type="number"
              min={0}
              value={priceMin}
              onChange={(event) => setPriceMin(Number(event.target.value) || 0)}
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">Harga Maksimum</label>
            <input
              type="number"
              min={0}
              value={priceMax}
              onChange={(event) => setPriceMax(Number(event.target.value) || 0)}
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Reservasi</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reservasi Aktif</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">{summary.active}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Nilai Reservasi</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">
            {formatCurrency(summary.totalValue)}
          </CardContent>
        </Card>
      </div>

      {/* ── Tabel Reservasi ── */}
      <DataTable<ReservationRow>
        data={filteredReservations}
        columns={[
          {
            id: "guest",
            header: "Tamu",
            accessorFn: (row) => (
              <div>
                <p className="font-medium text-on-surface">{row.guestName}</p>
                <p className="text-xs text-on-surface/40">{row.guestEmail}</p>
              </div>
            ),
            sortable: true,
          },
          {
            id: "accommodation",
            header: "Penginapan",
            accessorFn: (row) => ACCOMMODATIONS.find((a) => a.id === row.accommodationId)?.name ?? "-",
            hideOnMobile: true,
          },
          { id: "room", header: "Kamar", accessorKey: "roomName" as keyof ReservationRow, hideOnMobile: true },
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
            id: "nights",
            header: "Malam",
            accessorFn: (row) => Math.round(
              (new Date(row.checkOut).getTime() - new Date(row.checkIn).getTime()) / (1000 * 60 * 60 * 24)
            ),
            hideOnMobile: true,
          },
          {
            id: "value",
            header: "Nilai",
            accessorFn: (row) => (
              <span className="font-semibold text-on-surface whitespace-nowrap">
                {formatCurrency(row.totalPrice)}
              </span>
            ),
            sortable: true,
          },
          {
            id: "status",
            header: "Status Reservasi",
            accessorFn: (row) => {
              const meta = RESERVATION_STATUS_META[row.status];
              return <Badge className={meta.className}>{meta.label}</Badge>;
            },
            sortable: true,
          },
          {
            id: "payment",
            header: "Status Bayar",
            accessorFn: (row) => {
              const meta = PAYMENT_STATUS_META[row.paymentStatus];
              return <Badge className={meta.className}>{meta.label}</Badge>;
            },
            sortable: true,
            hideOnMobile: true,
          },
        ] satisfies ColumnDef<ReservationRow>[]}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari tamu..."
        searchableFields={["guestName" as keyof ReservationRow, "guestEmail" as keyof ReservationRow, "roomName" as keyof ReservationRow]}
        actions={(row) => [
          { label: "Lihat Detail", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
        ]}
        emptyState={{
          title: "Tidak ada reservasi ditemukan",
          description: "Tidak ada data reservasi untuk kombinasi filter yang dipilih.",
        }}
      />
    </div>
  );
}
