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
import { FinanceReportsTables } from "@/features/accommodation/components/finance-reports-tables";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

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
    return { id: experience.id, name: experience.name, gross, organizer, village, platform, split };
  });

  const propertyRows = ACCOMMODATIONS.map((accommodation) => {
    const accRes = reservations.filter((r) => r.accommodationId === accommodation.id);
    const accPaid = accRes.filter((r) => r.paymentStatus === "success");
    const accPending = accRes.filter((r) => r.paymentStatus === "pending");
    const accCancelled = accRes.filter((r) => r.status === "cancelled");
    const accRevenue = accPaid.reduce((sum, r) => sum + r.totalPrice, 0);
    const payments = getPaymentsByAccommodationId(accommodation.id);
    const platformRevenue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
    return {
      id: accommodation.id,
      name: accommodation.name,
      totalReservations: accRes.length,
      paidCount: accPaid.length,
      pendingCount: accPending.length,
      cancelledCount: accCancelled.length,
      revenue: accRevenue || platformRevenue,
    };
  });

  const reservationRows = reservations.map((r) => ({
    id: r.id,
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    accommodationName: getAccommodationNameById(r.accommodationId),
    roomName: r.roomName,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    totalPrice: r.totalPrice,
    paymentStatus: r.paymentStatus,
    status: r.status,
  }));

  const experienceGrossTotal = experienceRevenueRows.reduce((sum, item) => sum + item.gross, 0);
  const organizerTotal = experienceRevenueRows.reduce((sum, item) => sum + item.organizer, 0);
  const villageTotal = experienceRevenueRows.reduce((sum, item) => sum + item.village, 0);
  const platformTotal = experienceRevenueRows.reduce((sum, item) => sum + item.platform, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-on-surface/60">
          {t("subtitle")}
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-on-surface">{formatCurrency(consolidated.totalRevenue)}</p>
            <p className="mt-0.5 text-xs text-on-surface/40">{t("kpi.transactions", { count: consolidated.totalTransactions })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.settled")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">{formatCurrency(paidTotal)}</p>
            <p className="mt-0.5 text-xs text-on-surface/40">{t("kpi.settledHint")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.pending")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(pendingTotal)}</p>
            <p className="mt-0.5 text-xs text-on-surface/40">{t("kpi.pendingHint")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.refunded")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-violet-600">{formatCurrency(refundedTotal)}</p>
            <p className="mt-0.5 text-xs text-on-surface/40">{t("kpi.refundedHint")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("experienceShare.title")}</CardTitle>
          <p className="text-xs text-on-surface/60">
            {t("experienceShare.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-lg border-0 p-3">
              <p className="text-xs text-on-surface/60">{t("experienceShare.gross")}</p>
              <p className="text-lg font-semibold text-on-surface">{formatCurrency(experienceGrossTotal)}</p>
            </div>
            <div className="rounded-lg border-0 p-3">
              <p className="text-xs text-on-surface/60">{t("experienceShare.organizer")}</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(organizerTotal)}</p>
            </div>
            <div className="rounded-lg border-0 p-3">
              <p className="text-xs text-on-surface/60">{t("experienceShare.village")}</p>
              <p className="text-lg font-semibold text-blue-700">{formatCurrency(villageTotal)}</p>
            </div>
            <div className="rounded-lg border-0 p-3">
              <p className="text-xs text-on-surface/60">{t("experienceShare.platform")}</p>
              <p className="text-lg font-semibold text-violet-700">{formatCurrency(platformTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Charts Row 1: Trend + Property Revenue ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.monthlyTrend.title")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.monthlyTrend.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.revenueByProperty.title")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.revenueByProperty.subtitle")}</p>
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
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.reservationStatus.title")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.reservationStatus.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ReservationStatusDonutChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.paymentStatus.title")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.paymentStatus.subtitle")}</p>
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
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.roomStock.title")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.roomStock.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <RoomAvailabilityBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.roomTypeRevenue.title")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.roomTypeRevenue.subtitle")}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <RoomTypeRevenueChart />
          </CardContent>
        </Card>
      </div>

      <FinanceReportsTables
        experienceRows={experienceRevenueRows}
        propertyRows={propertyRows}
        reservationRows={reservationRows}
      />
    </div>
  );
}
