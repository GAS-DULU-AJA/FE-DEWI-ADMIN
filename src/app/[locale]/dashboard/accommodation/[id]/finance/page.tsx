import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { BankAccountForm } from "@/features/accommodation/components/bank-account-form";
import {
  getAccommodationById,
  getBankAccountByAccommodationId,
  getPaymentsByAccommodationId,
  getReservationsByAccommodationId,
  getWithdrawalsByAccommodationId,
  calculateOccupancyRate,
} from "@/features/accommodation/utils";
import { PropertyDetailTabs } from "@/features/accommodation/components/property-detail-tabs";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const RESERVATION_STATUS_META: Record<string, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-amber-100 text-amber-700" },
  confirmed:    { label: "Confirmed",    className: "bg-blue-100 text-blue-700" },
  checked_in:   { label: "Checked In",   className: "bg-emerald-100 text-emerald-700" },
  checked_out:  { label: "Selesai",      className: "bg-stone-100 text-stone-700" },
  cancelled:    { label: "Dibatalkan",   className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending:  { label: "Pending",  className: "bg-amber-100 text-amber-700" },
  success:  { label: "Lunas",    className: "bg-emerald-100 text-emerald-700" },
  failed:   { label: "Gagal",    className: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", className: "bg-violet-100 text-violet-700" },
};

export default async function PropertyFinancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  const payments = getPaymentsByAccommodationId(id);
  const reservations = getReservationsByAccommodationId(id);
  const occupancyRate = calculateOccupancyRate(id);
  const bankAccount = getBankAccountByAccommodationId(id);
  const withdrawals = getWithdrawalsByAccommodationId(id);

  const gross = payments.reduce((total, payment) => total + payment.totalAmount, 0);
  const platformFee = payments.reduce((total, payment) => total + payment.platformFee, 0);
  const net = gross - platformFee;
  const paidRevenue = reservations
    .filter((r) => r.paymentStatus === "success")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Keuangan Per Penginapan"
        description={accommodation.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: accommodation.name, href: `/dashboard/accommodation/${id}` },
          { label: "Keuangan" },
        ]}
        backHref={`/dashboard/accommodation/${id}`}
      />

      <PropertyDetailTabs propertyId={id} activeKey="finance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pendapatan Kotor</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-stone-900">
            {formatCurrency(gross || paidRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Biaya Platform</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-red-600">
            {formatCurrency(platformFee)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pendapatan Bersih</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-emerald-700">
            {formatCurrency(net || paidRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-stone-900">
            {occupancyRate}%
          </CardContent>
        </Card>
      </div>

      {/* Reservations table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histori Reservasi</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {reservations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-stone-500">
              Belum ada reservasi untuk penginapan ini.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr>
                  {["Tamu", "Kamar", "Check-In", "Check-Out", "Nilai", "Pembayaran", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-medium text-stone-500"
                      >
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
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {reservation.guestName}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600">{reservation.roomName}</td>
                      <td className="px-4 py-3 text-xs text-stone-500">{reservation.checkIn}</td>
                      <td className="px-4 py-3 text-xs text-stone-500">{reservation.checkOut}</td>
                      <td className="px-4 py-3 font-medium text-stone-900">
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
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {withdrawals.length === 0 ? (
              <p className="text-sm text-stone-500">Belum ada permintaan pencairan dana.</p>
            ) : (
              withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 p-3"
                >
                  <div>
                    <p className="font-medium text-stone-900">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-xs text-stone-500">
                      Diajukan {formatDateShort(withdrawal.requestedAt)}
                      {withdrawal.paidAt ? ` · Dibayar ${formatDateShort(withdrawal.paidAt)}` : ""}
                    </p>
                  </div>
                  <Badge className={PAYMENT_STATUS_META[withdrawal.status === "paid" ? "success" : withdrawal.status === "rejected" ? "failed" : "pending"].className}>
                    {withdrawal.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {bankAccount ? <BankAccountForm account={bankAccount} /> : null}
      </div>
    </div>
  );
}
