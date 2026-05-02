"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  PARTNER_APPLICATIONS,
  VILLAGE_KPI,
  VILLAGE_REVIEWS,
} from "@/features/village/mock-data";
import {
  VillageRevenueTrendChart,
  PartnerTrendChart,
  FacilityUtilizationDonutLike,
} from "@/features/village/components/dashboard-charts";
import { DocumentGateBanner } from "@/features/village/components/document-gate-banner";
import { formatCurrency } from "@/lib/utils";
import { Building2, CalendarDays, CheckSquare, Wallet } from "lucide-react";

export default function PengelolaDesaDashboard() {
  const t = useTranslations("village");

  const recentActivity = useMemo(
    () => [
      ...PARTNER_APPLICATIONS.map((item) => ({
        id: item.id,
        title: `${item.organizationName} ${t("dashboard.activity.application")}`,
        date: item.submittedAt,
      })),
      ...VILLAGE_REVIEWS.map((item) => ({
        id: item.id,
        title: `${item.reviewerName} ${t("dashboard.activity.review")}`,
        date: item.createdAt,
      })),
    ].slice(0, 5),
    [t]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-container-high/80 bg-white/80 p-4 shadow-ambient backdrop-blur sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("dashboard.title")}</h1>
            <p className="mt-0.5 text-sm text-on-surface/60">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Document Gate Banner — fitur transaksi belum aktif sampai dokumen terverifikasi */}
      <DocumentGateBanner />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatCard label={t("dashboard.kpi.totalPartners")} value={VILLAGE_KPI.totalPartners} icon="partners" color="blue" />
        <StatCard label={t("dashboard.kpi.pendingApprovals")} value={VILLAGE_KPI.pendingApprovals} icon="approval" color="amber" />
        <StatCard label={t("dashboard.kpi.activeExperiences")} value={VILLAGE_KPI.activeExperiences} icon="calendar" color="violet" />
        <StatCard label={t("dashboard.kpi.monthlyRevenue")} value={formatCurrency(VILLAGE_KPI.monthlyRevenue)} icon="revenue" color="emerald" />
        <StatCard label={t("dashboard.kpi.utilizationRate")} value={`${VILLAGE_KPI.facilityUtilizationRate}%`} icon="package" color="rose" />
        <StatCard label={t("dashboard.kpi.averageRating")} value={`${VILLAGE_KPI.averageVillageRating} / 5`} icon="star" color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VillageRevenueTrendChart />
        <PartnerTrendChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FacilityUtilizationDonutLike />
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="rounded-lg border-0 p-3 transition-colors hover:border-primary/200 hover:bg-primary/10/30">
                <p className="text-sm font-medium text-on-surface">{item.title}</p>
                <p className="text-xs text-on-surface/60">{item.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quickActions")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Button asChild variant="outline" className="justify-start"><Link href="/dashboard/village-admin/village-data"><Building2 className="h-4 w-4" />{t("actions.registerVillageData")}</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link href="/dashboard/village-admin/approval"><CheckSquare className="h-4 w-4" />{t("actions.verifyPartner")}</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link href="/dashboard/village-admin/experiences/add"><CalendarDays className="h-4 w-4" />{t("actions.createExperience")}</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link href="/dashboard/finance/reports"><Wallet className="h-4 w-4" />{t("actions.viewFinancialReport")}</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
