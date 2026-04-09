import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCOMMODATIONS,
  getConsolidatedRevenue,
  getPaymentsByAccommodationId,
  getAllReservations,
  getAccommodationNameById,
} from "@/features/accommodation";
import {
  MonthlyRevenueTrendChart,
  RevenueByPropertyChart,
  ReservationStatusDonutChart,
  PaymentStatusDonutChart,
  RoomAvailabilityBarChart,
  RoomTypeRevenueChart,
} from "@/features/accommodation/components/dashboard-charts";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const RESERVATION_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Aktif", className: "bg-emerald-100 text-emerald-700" },
  checked_out: { label: "Selesai", className: "bg-stone-100 text-stone-700" },
  cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  success: { label: "Lunas", className: "bg-emerald-100 text-emerald-700" },
  failed: { label: "Gagal", className: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", className: "bg-violet-100 text-violet-700" },
};

export default function LaporanKeuanganPage() {
  const consolidated = getConsolidatedRevenue();
  const reservations = getAllReservations();

  const paidTotal = reservations
    .filter((r) => r.paymentStatus === "success")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingTotal = reservations
    .filter((r) => r.paymentStatus === "pending")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const refundedTotal = reservations
    .filter((r) => r.paymentStatus === "refunded")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Laporan Keuangan</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Analisis visual performa finansial, tren pendapatan, dan status transaksi seluruh properti.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-stone-900">{formatCurrency(consolidated.totalRevenue)}</p>
            <p className="mt-0.5 text-xs text-stone-400">{consolidated.totalTransactions} transaksi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">Sudah Settled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(paidTotal)}</p>
            <p className="mt-0.5 text-xs text-stone-400">pembayaran lunas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">Menunggu Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(pendingTotal)}</p>
            <p className="mt-0.5 text-xs text-stone-400">belum diselesaikan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">Refunded / Dibatalkan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-violet-600">{formatCurrency(refundedTotal)}</p>
            <p className="mt-0.5 text-xs text-stone-400">dikembalikan ke tamu</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 1: Trend + Property Revenue ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Tren Pendapatan Bulanan
            </CardTitle>
            <p className="text-xs text-stone-400">Riwayat 6 bulan terakhir (simulasi + aktual Apr&apos;26)</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Pendapatan Per Properti
            </CardTitle>
            <p className="text-xs text-stone-400">Hanya transaksi dengan status pembayaran lunas</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <RevenueByPropertyChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 2: Reservation + Payment status ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Distribusi Status Reservasi
            </CardTitle>
            <p className="text-xs text-stone-400">Sebaran status dari seluruh booking</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ReservationStatusDonutChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Distribusi Status Pembayaran
            </CardTitle>
            <p className="text-xs text-stone-400">Komposisi status pembayaran semua transaksi</p>
          </CardHeader>
          <CardContent className="pb-4">
            <PaymentStatusDonutChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 3: Room stock + Room type revenue ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Stok Kamar Per Properti
            </CardTitle>
            <p className="text-xs text-stone-400">Unit tersedia, terisi, dan dalam pemeliharaan</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <RoomAvailabilityBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Kontribusi Revenue Per Tipe Kamar
            </CardTitle>
            <p className="text-xs text-stone-400">Total pendapatan lunas berdasarkan tipe kamar</p>
          </CardHeader>
          <CardContent className="pb-4">
            <RoomTypeRevenueChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Breakdown Per Properti ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Per Penginapan</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                {["Penginapan", "Reservasi", "Lunas", "Pending", "Dibatalkan", "Pendapatan"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-stone-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ACCOMMODATIONS.map((accommodation) => {
                const accRes = reservations.filter((r) => r.accommodationId === accommodation.id);
                const accPaid = accRes.filter((r) => r.paymentStatus === "success");
                const accPending = accRes.filter((r) => r.paymentStatus === "pending");
                const accCancelled = accRes.filter((r) => r.status === "cancelled");
                const accRevenue = accPaid.reduce((sum, r) => sum + r.totalPrice, 0);
                const payments = getPaymentsByAccommodationId(accommodation.id);
                const platformRevenue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
                return (
                  <tr key={accommodation.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{accommodation.name}</td>
                    <td className="px-4 py-3 text-stone-600">{accRes.length}</td>
                    <td className="px-4 py-3 font-medium text-emerald-700">{accPaid.length}</td>
                    <td className="px-4 py-3 text-amber-600">{accPending.length}</td>
                    <td className="px-4 py-3 text-red-600">{accCancelled.length}</td>
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      {formatCurrency(accRevenue || platformRevenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Riwayat Transaksi ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Riwayat Transaksi Reservasi</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                {["ID", "Tamu", "Penginapan", "Kamar", "Check-In", "Check-Out", "Nilai", "Pembayaran", "Status"].map(
                  (h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-stone-500">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reservations.map((reservation) => {
                const statusMeta = RESERVATION_STATUS_META[reservation.status];
                const payMeta = PAYMENT_STATUS_META[reservation.paymentStatus];
                return (
                  <tr key={reservation.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{reservation.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{reservation.guestName}</p>
                      <p className="text-xs text-stone-400">{reservation.guestEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      {getAccommodationNameById(reservation.accommodationId)}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">{reservation.roomName}</td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {formatDateShort(reservation.checkIn)}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      {formatDateShort(reservation.checkOut)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-900 whitespace-nowrap">
                      {formatCurrency(reservation.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={payMeta.className}>{payMeta.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusMeta.className}>{statusMeta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
