"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VILLAGE_KPI } from "@/features/village/mock-data";
import {
  VillageRevenueTrendChart,
  PartnerTrendChart,
  FacilityUtilizationDonutLike,
} from "@/features/village/components/dashboard-charts";
import { VisitorCounterCard, DemographicsCard, TopPerformersTable } from "@/features/village/components/visitor-stats";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { formatCurrency } from "@/lib/utils";

export default function VillageAdminAnalyticsPage() {
  const t = useTranslations("village");
  const kpi = VILLAGE_KPI;

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("analytics.title")}
        description={t("analytics.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.analytics") },
        ]}
      />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-on-surface/80">{t("analytics.kpiTitle")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs text-on-surface/60">{t("dashboard.kpi.totalPartners")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-2xl font-bold text-primary">{kpi.totalPartners}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs text-on-surface/60">{t("dashboard.kpi.pendingApprovals")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-2xl font-bold text-amber-600">{kpi.pendingApprovals}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs text-on-surface/60">{t("dashboard.kpi.activeExperiences")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-2xl font-bold text-primary">{kpi.activeExperiences}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs text-on-surface/60">{t("dashboard.kpi.monthlyRevenue")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-xl font-bold text-primary">{formatCurrency(kpi.monthlyRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs text-on-surface/60">{t("dashboard.kpi.utilizationRate")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-2xl font-bold text-primary">{kpi.facilityUtilizationRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs text-on-surface/60">{t("dashboard.kpi.averageRating")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-2xl font-bold text-primary">{kpi.averageVillageRating}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-on-surface/80">{t("analytics.revenueTitle")}</h2>
        <VillageRevenueTrendChart />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-on-surface/80">{t("analytics.partnerTitle")}</h2>
        <PartnerTrendChart />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-on-surface/80">{t("analytics.facilityTitle")}</h2>
        <FacilityUtilizationDonutLike />
      </section>

      {/* Statistik Kunjungan Wisatawan (Data Hub) */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-on-surface/80">Statistik Kunjungan Wisatawan</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <VisitorCounterCard />
          <DemographicsCard />
        </div>
      </section>

      {/* Top Performers */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-on-surface/80">Top Performer Mitra Desa</h2>
        <TopPerformersTable />
      </section>
    </div>
  );
}
