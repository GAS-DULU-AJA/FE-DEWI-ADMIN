import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAllReservations,
  getConsolidatedRevenue,
  getAccommodationNameById,
} from "@/features/accommodation/utils";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const PAYMENT_STATUS_META: Record<string, { className: string }> = {
  pending: { className: "bg-amber-100 text-amber-700" },
  success: { className: "bg-emerald-100 text-emerald-700" },
  failed: { className: "bg-red-100 text-red-700" },
  refunded: { className: "bg-violet-100 text-violet-700" },
};

export default async function ManajemenKeuanganPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "financeManagement" });
  const reservations = getAllReservations();
  const consolidated = getConsolidatedRevenue();

  const paidTotal = reservations
    .filter((r) => r.paymentStatus === "success")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingSettlement = reservations
    .filter((r) => r.paymentStatus === "pending")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const refundedAmount = reservations
    .filter((r) => r.paymentStatus === "refunded")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const estimatedPlatformFee = Math.round(paidTotal * 0.05);
  const estimatedAvailableBalance = Math.max(0, paidTotal - estimatedPlatformFee - refundedAmount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-stone-500">{t("kpi.availableBalance")}</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-emerald-700">
            {formatCurrency(estimatedAvailableBalance)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-stone-500">{t("kpi.pendingSettlement")}</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-amber-600">
            {formatCurrency(pendingSettlement)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-stone-500">{t("kpi.refundTotal")}</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-violet-700">
            {formatCurrency(refundedAmount)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-stone-500">{t("kpi.totalTransactions")}</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold text-stone-900">
            {consolidated.totalTransactions}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("transactionManagement.title")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                {[t("table.id"), t("table.date"), t("table.guest"), t("table.accommodation"), t("table.amount"), t("table.payment")].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-stone-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reservations.map((reservation) => {
                const payMeta = PAYMENT_STATUS_META[reservation.paymentStatus];
                return (
                  <tr key={reservation.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{reservation.id}</td>
                    <td className="px-4 py-3 text-xs text-stone-500">{formatDateShort(reservation.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-stone-900">{reservation.guestName}</td>
                    <td className="px-4 py-3 text-xs text-stone-600">
                      {getAccommodationNameById(reservation.accommodationId)}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">{formatCurrency(reservation.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <Badge className={payMeta.className}>{t(`paymentStatus.${reservation.paymentStatus}`)}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("withdraw.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600">{t("withdraw.method")}</label>
              <select className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm">
                <option>{t("withdraw.methodBank")}</option>
                <option>{t("withdraw.methodWallet")}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600">{t("withdraw.channel")}</label>
              <Input placeholder={t("withdraw.channelPlaceholder")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600">{t("withdraw.accountNumber")}</label>
              <Input placeholder={t("withdraw.accountNumberPlaceholder")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-600">{t("withdraw.amount")}</label>
              <Input type="number" min={100000} placeholder={t("withdraw.amountPlaceholder")} />
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              {t("withdraw.notice")}
            </div>
            <Button className="w-full">{t("withdraw.submit")}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("requirements.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc space-y-2 pl-5 text-sm text-stone-700">
              {[
                t("requirements.items.1"),
                t("requirements.items.2"),
                t("requirements.items.3"),
                t("requirements.items.4"),
                t("requirements.items.5"),
                t("requirements.items.6"),
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                {t("requirements.channelTitle")}
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-stone-600">
                {[
                  t("requirements.channels.1"),
                  t("requirements.channels.2"),
                  t("requirements.channels.3"),
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
