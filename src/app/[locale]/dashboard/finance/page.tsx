import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getConsolidatedRevenue,
  getAllReservations,
} from "@/features/accommodation/utils";
import {
  MonthlyRevenueTrendChart,
  PaymentStatusDonutChart,
} from "@/features/accommodation/components/dashboard-charts";
import { COORDINATION_REQUESTS, VILLAGE_KPI } from "@/features/village/mock-data";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Wallet, CheckCircle, AlertCircle } from "lucide-react";

export default async function FinanceOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "financeOverview" });

  const consolidated = getConsolidatedRevenue();
  const reservations = getAllReservations();

  const paidTotal = reservations
    .filter((r) => r.paymentStatus === "success")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const pendingTotal = reservations
    .filter((r) => r.paymentStatus === "pending")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const failedTotal = reservations
    .filter((r) => r.paymentStatus === "failed")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const refundedTotal = reservations
    .filter((r) => r.paymentStatus === "refunded")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const platformFeeRate = 0.05;
  const estimatedFee = paidTotal * platformFeeRate;
  const netRevenue = paidTotal - estimatedFee;

  const paidCount = reservations.filter((r) => r.paymentStatus === "success").length;
  const pendingCount = reservations.filter((r) => r.paymentStatus === "pending").length;
  const failedCount = reservations.filter(
    (r) => r.paymentStatus === "failed" || r.paymentStatus === "refunded",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-on-surface/60">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-on-surface">
              {formatCurrency(consolidated.totalRevenue).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-1 text-xs text-on-surface/40">
              {t("kpi.transactions", { count: consolidated.totalTransactions })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.settled")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(paidTotal).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-1 text-xs text-on-surface/40">{t("kpi.settledHint")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.pending")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-amber-600">
              {formatCurrency(pendingTotal).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-1 text-xs text-on-surface/40">{t("kpi.pendingHint")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-on-surface/60">{t("kpi.estimatedFee")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-on-surface/80">
              {formatCurrency(estimatedFee).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-1 text-xs text-on-surface/40">
              {t("kpi.feeRate", { rate: (platformFeeRate * 100).toFixed(0) })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-primary/200 bg-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle className="h-4 w-4" />
              {t("netBalance.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(netRevenue).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-2 text-xs text-primary">{t("netBalance.hint")}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <AlertCircle className="h-4 w-4" />
              {t("failureRefund.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-700">
              {formatCurrency(failedTotal + refundedTotal).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-2 text-xs text-amber-600">
              {failedTotal > 0 && `${t("failureRefund.failed")}: ${formatCurrency(failedTotal)}`}
              {failedTotal > 0 && refundedTotal > 0 && " · "}
              {refundedTotal > 0 && `${t("failureRefund.refunded")}: ${formatCurrency(refundedTotal)}`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-surface-container-high bg-surface-container-low">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              <Wallet className="h-4 w-4" />
              {t("statusSummary.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface/70">{t("statusSummary.paid")}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {paidCount}
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface/70">{t("statusSummary.pending")}</span>
              <Badge variant="outline" className="bg-amber-100 text-amber-700">
                {pendingCount}
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface/70">{t("statusSummary.failedRefund")}</span>
              <Badge variant="outline" className="bg-red-100 text-red-700">
                {failedCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-on-surface">
            {t("villageBreakdown.title")}
          </CardTitle>
          <p className="text-xs text-on-surface/40">{t("villageBreakdown.subtitle")}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border-0 bg-surface-container-low p-3">
            <p className="text-xs text-on-surface/60">{t("villageBreakdown.experiences")}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">
              {formatCurrency(Math.round(VILLAGE_KPI.monthlyRevenue * 0.52))}
            </p>
          </div>
          <div className="rounded-lg border-0 bg-surface-container-low p-3">
            <p className="text-xs text-on-surface/60">{t("villageBreakdown.facilityRentals")}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">
              {formatCurrency(Math.round(VILLAGE_KPI.monthlyRevenue * 0.31))}
            </p>
          </div>
          <div className="rounded-lg border-0 bg-surface-container-low p-3">
            <p className="text-xs text-on-surface/60">{t("villageBreakdown.externalSharing")}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">
              {formatCurrency(Math.round(VILLAGE_KPI.monthlyRevenue * 0.17))}
            </p>
            <p className="mt-1 text-[11px] text-on-surface/60">
              {t("villageBreakdown.activeCoordinations", {
                count: COORDINATION_REQUESTS.filter(
                  (item) => item.status !== "completed" && item.status !== "rejected",
                ).length,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.revenueTrend")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.revenueTrendHint")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("charts.paymentDistribution")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("charts.paymentDistributionHint")}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <PaymentStatusDonutChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/finance/reports" className="flex w-full items-center gap-3">
            <TrendingUp className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("quickActions.reports")}</p>
              <p className="text-xs text-on-surface/60">{t("quickActions.reportsHint")}</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/finance/management" className="flex w-full items-center gap-3">
            <Wallet className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("quickActions.management")}</p>
              <p className="text-xs text-on-surface/60">{t("quickActions.managementHint")}</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
