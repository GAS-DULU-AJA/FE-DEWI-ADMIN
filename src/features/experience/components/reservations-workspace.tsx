"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { CheckInManager } from "@/features/experience/components/check-in-manager";
import { ReservationActionPanel } from "@/features/experience/components/reservation-action-panel";
import type { ExperienceReservation } from "@/features/experience/types";
import { formatCurrency } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type ReservationTab = "list" | "actions" | "checkin";

export function ReservationsWorkspace({ reservations }: { reservations: ExperienceReservation[] }) {
  const t = useTranslations("experience");
  const locale = useLocale();
  const isId = locale === "id";

  const [activeTab, setActiveTab] = useState<ReservationTab>("list");
  const [reservationData, setReservationData] = useState<ExperienceReservation[]>(reservations);
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | ExperienceReservation["paymentStatus"]>("all");
  const [bookingFilter, setBookingFilter] = useState<"all" | ExperienceReservation["bookingStatus"]>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "totalPrice" | "paymentStatus">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pageSize = 6;

  const filteredReservations = useMemo(() => {
    const filtered = reservationData.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery =
        item.customerName.toLowerCase().includes(q) ||
        item.experienceName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);
      const matchesPayment = paymentFilter === "all" || item.paymentStatus === paymentFilter;
      const matchesBooking = bookingFilter === "all" || item.bookingStatus === bookingFilter;
      return matchesQuery && matchesPayment && matchesBooking;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "totalPrice") {
        return sortOrder === "asc" ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
      }
      if (sortBy === "paymentStatus") {
        const va = a.paymentStatus;
        const vb = b.paymentStatus;
        return sortOrder === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });
  }, [bookingFilter, paymentFilter, query, reservationData, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / pageSize));
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalRevenue = useMemo(
    () => reservationData.filter((r) => r.paymentStatus === "success").reduce((sum, r) => sum + r.totalPrice, 0),
    [reservationData]
  );

  const paidCount = reservationData.filter((r) => r.paymentStatus === "success").length;
  const pendingCount = reservationData.filter((r) => r.paymentStatus === "pending").length;

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = paginatedReservations.map((item) => item.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const markSelectedNoShow = () => {
    if (selectedIds.length === 0) return;
    setReservationData((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, bookingStatus: "no_show" }
          : item
      )
    );
    setSelectedIds([]);
  };

  const exportSelectedCsv = () => {
    const targets = reservationData.filter((item) => selectedIds.includes(item.id));
    if (targets.length === 0) return;

    const header = ["id", "customerName", "experienceName", "ticketTypeName", "quantity", "bookingStatus", "paymentStatus", "totalPrice", "createdAt"];
    const rows = targets.map((item) => [
      item.id,
      item.customerName,
      item.experienceName,
      item.ticketTypeName,
      String(item.quantity),
      item.bookingStatus,
      item.paymentStatus,
      String(item.totalPrice),
      item.createdAt,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experience-reservations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFilteredCsv = () => {
    if (filteredReservations.length === 0) return;

    const header = ["id", "customerName", "experienceName", "ticketTypeName", "quantity", "bookingStatus", "paymentStatus", "totalPrice", "createdAt"];
    const rows = filteredReservations.map((item) => [
      item.id,
      item.customerName,
      item.experienceName,
      item.ticketTypeName,
      String(item.quantity),
      item.bookingStatus,
      item.paymentStatus,
      String(item.totalPrice),
      item.createdAt,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experience-reservations-filtered.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: Array<{ id: ReservationTab; label: string }> = [
    { id: "list", label: isId ? "Daftar Reservasi" : "Reservation List" },
    { id: "actions", label: isId ? "Aksi Reservasi" : "Reservation Actions" },
    { id: "checkin", label: isId ? "Check-in" : "Check-in" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-500">{isId ? "Total Reservasi" : "Total Reservations"}</p>
            <p className="text-2xl font-bold text-stone-900">{reservations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-500">{isId ? "Sudah Dibayar" : "Paid"}</p>
            <p className="text-2xl font-bold text-emerald-600">{paidCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-500">{isId ? "Menunggu Pembayaran" : "Pending Payment"}</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-stone-500">{isId ? "Revenue Terkonfirmasi" : "Confirmed Revenue"}</p>
            <p className="text-xl font-bold text-stone-900">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      <SegmentedTabs tabs={tabs} active={activeTab} onChange={setActiveTab} sticky />

      {activeTab === "list" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{isId ? "Reservasi Masuk" : "Incoming Reservations"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
              <Input
                value={query}
                onChange={(e) => {
                  setCurrentPage(1);
                  setQuery(e.target.value);
                }}
                placeholder={isId ? "Cari nama, event, atau ID reservasi..." : "Search by name, event, or reservation ID..."}
                className="md:col-span-2"
              />
              <select
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                value={paymentFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setPaymentFilter(e.target.value as typeof paymentFilter);
                }}
              >
                <option value="all">{isId ? "Semua Status Pembayaran" : "All Payment Status"}</option>
                <option value="success">{t("reservationStatus.success")}</option>
                <option value="pending">{t("reservationStatus.pending")}</option>
                <option value="failed">{t("reservationStatus.failed")}</option>
                <option value="refunded">{t("reservationStatus.refunded")}</option>
              </select>
              <select
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                value={bookingFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setBookingFilter(e.target.value as typeof bookingFilter);
                }}
              >
                <option value="all">{isId ? "Semua Status Booking" : "All Booking Status"}</option>
                <option value="confirmed">{t("bookingStatus.confirmed")}</option>
                <option value="checked_in">{t("bookingStatus.checked_in")}</option>
                <option value="no_show">{t("bookingStatus.no_show")}</option>
                <option value="cancelled">{t("bookingStatus.cancelled")}</option>
              </select>
              <select
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="createdAt">{isId ? "Urutkan: Tanggal" : "Sort: Date"}</option>
                <option value="totalPrice">{isId ? "Urutkan: Total" : "Sort: Total"}</option>
                <option value="paymentStatus">{isId ? "Urutkan: Status Bayar" : "Sort: Payment Status"}</option>
              </select>
              <select
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
              >
                <option value="desc">{isId ? "Terbaru / Terbesar" : "Newest / Highest"}</option>
                <option value="asc">{isId ? "Terlama / Terkecil" : "Oldest / Lowest"}</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
              <p className="text-xs text-stone-600">
                {isId
                  ? `${selectedIds.length} reservasi dipilih`
                  : `${selectedIds.length} reservations selected`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={markSelectedNoShow}
                  className="rounded-md border border-amber-300 bg-white px-2 py-1 text-xs text-amber-700"
                >
                  {isId ? "Bulk No-show" : "Bulk No-show"}
                </button>
                <button
                  onClick={exportSelectedCsv}
                  className="rounded-md border border-blue-300 bg-white px-2 py-1 text-xs text-blue-700"
                >
                  {isId ? "Export Terpilih" : "Export Selected"}
                </button>
                <button
                  onClick={exportFilteredCsv}
                  className="rounded-md border border-indigo-300 bg-white px-2 py-1 text-xs text-indigo-700"
                >
                  {isId ? "Export Semua Filter" : "Export Filtered"}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-stone-200">
              <table className="w-full min-w-190 text-sm">
                <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={paginatedReservations.length > 0 && paginatedReservations.every((item) => selectedIds.includes(item.id))}
                        onChange={toggleSelectAllVisible}
                      />
                    </th>
                    <th className="px-4 py-3">{isId ? "Reservasi" : "Reservation"}</th>
                    <th className="px-4 py-3">{isId ? "Pelanggan" : "Customer"}</th>
                    <th className="px-4 py-3">{isId ? "Tiket" : "Ticket"}</th>
                    <th className="px-4 py-3">{isId ? "Tanggal" : "Date"}</th>
                    <th className="px-4 py-3">{isId ? "Booking" : "Booking"}</th>
                    <th className="px-4 py-3">{isId ? "Pembayaran" : "Payment"}</th>
                    <th className="px-4 py-3">{isId ? "Total" : "Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReservations.map((item) => (
                    <tr key={item.id} className="border-t border-stone-200 align-top">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelected(item.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-stone-900">{item.id}</p>
                        <p className="text-xs text-stone-500">{item.experienceName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-800">{item.customerName}</p>
                        <p className="text-xs text-stone-500">{item.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-stone-800">{item.ticketTypeName}</p>
                        <p className="text-xs text-stone-500">{t("components.qty")}: {item.quantity}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600">{new Date(item.createdAt).toLocaleDateString(locale)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="blue">{t(`bookingStatus.${item.bookingStatus}`)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={item.paymentStatus === "success" ? "default" : item.paymentStatus === "pending" ? "amber" : "secondary"}>
                          {t(`reservationStatus.${item.paymentStatus}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-stone-900">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-stone-500">
                {isId
                  ? `Menampilkan ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredReservations.length)} dari ${filteredReservations.length}`
                  : `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredReservations.length)} of ${filteredReservations.length}`}
              </p>
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-stone-300 bg-white px-3 py-1 text-xs text-stone-700 disabled:opacity-50"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  {isId ? "Sebelumnya" : "Previous"}
                </button>
                <button
                  className="rounded-md border border-stone-300 bg-white px-3 py-1 text-xs text-stone-700 disabled:opacity-50"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  {isId ? "Berikutnya" : "Next"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "actions" && <ReservationActionPanel reservations={reservationData} />}
      {activeTab === "checkin" && <CheckInManager reservations={reservationData} />}
    </div>
  );
}
