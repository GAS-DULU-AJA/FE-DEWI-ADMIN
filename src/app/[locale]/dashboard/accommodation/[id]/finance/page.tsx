import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { BankAccountForm } from "@/features/accommodation/components/bank-account-form";
import { PropertyReservationsTable } from "@/features/accommodation/components/property-reservations-table";
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

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending:  { label: "Pending",  className: "bg-amber-100 text-amber-700" },
  success:  { label: "Lunas",    className: "bg-primary/10 text-primary" },
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
          <CardContent className="text-xl font-semibold text-on-surface">
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
          <CardContent className="text-xl font-semibold text-primary">
            {formatCurrency(net || paidRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-on-surface">
            {occupancyRate}%
          </CardContent>
        </Card>
      </div>

      {/* Reservations table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histori Reservasi</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyReservationsTable reservations={reservations} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {withdrawals.length === 0 ? (
              <p className="text-sm text-on-surface/60">Belum ada permintaan pencairan dana.</p>
            ) : (
              withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between rounded-lg border-0 p-3"
                >
                  <div>
                    <p className="font-medium text-on-surface">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-xs text-on-surface/60">
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
