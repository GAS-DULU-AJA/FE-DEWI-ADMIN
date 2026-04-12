import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import {
  getConsolidatedRevenue,
  getPaymentsByAccommodationId,
  getAllReservations,
  getAccommodationNameById,
} from "@/features/accommodation/utils";
import { DEFAULT_REVENUE_SPLIT } from "@/features/experience/constants";
import {
  getExperienceCoordinations,
  getExperiences,
} from "@/features/experience/utils";
import {
  MonthlyRevenueTrendChart,
  RevenueByPropertyChart,
  ReservationStatusDonutChart,
  PaymentStatusDonutChart,
  RoomAvailabilityBarChart,
  RoomTypeRevenueChart,
} from "@/features/accommodation/components/dashboard-charts";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const RESERVATION_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  checked_in: "bg-emerald-100 text-emerald-700",
  checked_out: "bg-stone-100 text-stone-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-violet-100 text-violet-700",
};

export default async function LaporanKeuanganPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "financeReports" });
  const consolidated = getConsolidatedRevenue();
  const reservations = getAllReservations();
  const experiences = getExperiences();
  const coordinations = getExperienceCoordinations();

  const paidTotal = reservations
    .filter((r) => r.paymentStatus === "success")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingTotal = reservations
    .filter((r) => r.paymentStatus === "pending")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const refundedTotal = reservations
    .filter((r) => r.paymentStatus === "refunded")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const experienceRevenueRows = experiences.map((experience) => {
    const split =
      coordinations.find((item) => item.experienceId === experience.id)?.revenueSplit ??
      DEFAULT_REVENUE_SPLIT;
    const gross = experience.monthlyRevenue;
    const organizer = Math.round((gross * split.organizer) / 100);
    const village = Math.round((gross * split.village) / 100);
    const platform = Math.round((gross * split.platform) / 100);
    return {
      id: experience.id,
      name: experience.name,
      gross,
      organizer,
      village,
      platform,
      split,
    };
  });

  const experienceGrossTotal = experienceRevenueRows.reduce((sum, item) => sum + item.gross, 0);
  const organizerTotal = experienceRevenueRows.reduce((sum, item) => sum + item.organizer, 0);
  const villageTotal = experienceRevenueRows.reduce((sum, item) => sum + item.village, 0);
  const platformTotal = experienceRevenueRows.reduce((sum, item) => sum + item.platform, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {t("subtitle")}
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">{t("kpi.totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-stone-900">{formatCurrency(consolidated.totalRevenue)}</p>
            <p className="mt-0.5 text-xs text-stone-400">{t("kpi.transactions", { count: consolidated.totalTransactions })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">{t("kpi.settled")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(paidTotal)}</p>
            <p className="mt-0.5 text-xs text-stone-400">{t("kpi.settledHint")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">{t("kpi.pending")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(pendingTotal)}</p>
            <p className="mt-0.5 text-xs text-stone-400">{t("kpi.pendingHint")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-stone-500">{t("kpi.refunded")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-violet-600">{formatCurrency(refundedTotal)}</p>
            <p className="mt-0.5 text-xs text-stone-400">{t("kpi.refundedHint")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("experienceShare.title")}</CardTitle>
          <p className="text-xs text-stone-500">
            {t("experienceShare.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-lg border border-stone-200 p-3">
              <p className="text-xs text-stone-500">{t("experienceShare.gross")}</p>
              <p className="text-lg font-semibold text-stone-900">{formatCurrency(experienceGrossTotal)}</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-3">
              <p className="text-xs text-stone-500">{t("experienceShare.organizer")}</p>
              <p className="text-lg font-semibold text-emerald-700">{formatCurrency(organizerTotal)}</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-3">
              <p className="text-xs text-stone-500">{t("experienceShare.village")}</p>
              <p className="text-lg font-semibold text-blue-700">{formatCurrency(villageTotal)}</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-3">
              <p className="text-xs text-stone-500">{t("experienceShare.platform")}</p>
              <p className="text-lg font-semibold text-violet-700">{formatCurrency(platformTotal)}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-50">
                <tr>
                  {[
                    t("table.experience"),
                    t("table.split"),
                    t("table.gross"),
                    t("table.organizer"),
                    t("table.village"),
                    t("table.platform"),
                  ].map((item) => (
                    <th key={item} className="px-3 py-2 text-left text-xs font-medium text-stone-500">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {experienceRevenueRows.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="px-3 py-2 font-medium text-stone-900">{item.name}</td>
                    <td className="px-3 py-2 text-xs text-stone-600">
                      {item.split.organizer}/{item.split.village}/{item.split.platform}
                    </td>
                    <td className="px-3 py-2 text-stone-700">{formatCurrency(item.gross)}</td>
                    <td className="px-3 py-2 text-emerald-700">{formatCurrency(item.organizer)}</td>
                    <td className="px-3 py-2 text-blue-700">{formatCurrency(item.village)}</td>
                    <td className="px-3 py-2 text-violet-700">{formatCurrency(item.platform)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Charts Row 1: Trend + Property Revenue ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              {t("charts.monthlyTrend.title")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("charts.monthlyTrend.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              {t("charts.revenueByProperty.title")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("charts.revenueByProperty.subtitle")}</p>
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
              {t("charts.reservationStatus.title")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("charts.reservationStatus.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ReservationStatusDonutChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              {t("charts.paymentStatus.title")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("charts.paymentStatus.subtitle")}</p>
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
              {t("charts.roomStock.title")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("charts.roomStock.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <RoomAvailabilityBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              {t("charts.roomTypeRevenue.title")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("charts.roomTypeRevenue.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <RoomTypeRevenueChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Breakdown Per Properti ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("propertySummary.title")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                {[t("table.accommodation"), t("table.reservation"), t("table.paid"), t("table.pending"), t("table.cancelled"), t("table.revenue")].map((h) => (
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
          <CardTitle className="text-base">{t("reservationHistory.title")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                {[t("table.id"), t("table.guest"), t("table.accommodation"), t("table.room"), t("table.checkIn"), t("table.checkOut"), t("table.amount"), t("table.payment"), t("table.status")].map(
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
                const statusMeta = {
                  label: t(`reservationStatus.${reservation.status}`),
                  className: RESERVATION_STATUS_CLASS[reservation.status],
                };
                const payMeta = {
                  label: t(`paymentStatus.${reservation.paymentStatus}`),
                  className: PAYMENT_STATUS_CLASS[reservation.paymentStatus],
                };
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
