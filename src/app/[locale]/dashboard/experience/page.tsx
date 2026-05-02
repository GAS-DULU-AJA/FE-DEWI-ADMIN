import { StatCard } from "@/components/dashboard/stat-card";
import { ExperienceDashboardSectionsTabs } from "@/features/experience/components/experience-dashboard-sections-tabs";
import { getExperiences } from "@/features/experience/utils";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { VillageApprovalBanner } from "@/features/shared/components/village-approval-banner";

export default async function ExperienceDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const experiences = getExperiences();
  const totalBookings = experiences.reduce((sum, item) => sum + item.totalBookings, 0);
  const totalRevenue = experiences.reduce((sum, item) => sum + item.monthlyRevenue, 0);
  const pendingApprovals = experiences.filter((item) => item.status === "under_review").length;
  // Show village approval banner if any experience is awaiting village approval
  const pendingVillageApproval = experiences.find(
    (item) => item.villageApprovalStatus !== "approved" && item.villageId
  );

  return (
    <div className="space-y-6">
      {pendingVillageApproval ? (
        <VillageApprovalBanner
          villageName={pendingVillageApproval.targetVillage}
          status={pendingVillageApproval.villageApprovalStatus}
        />
      ) : null}

      <div className="rounded-2xl border border-surface-container-high/80 bg-white/80 p-4 shadow-ambient backdrop-blur sm:p-5">
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("dashboard.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-surface-container-high/70 bg-white/70 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        <StatCard label={t("dashboard.kpi.totalExperiences")} value={experiences.length} icon="calendar" color="violet" />
        <StatCard label={t("dashboard.kpi.totalBookings")} value={totalBookings} icon="visitors" color="emerald" />
        <StatCard label={t("dashboard.kpi.monthlyRevenue")} value={formatCurrency(totalRevenue)} icon="revenue" color="amber" />
        <StatCard label={t("dashboard.kpi.pendingApprovals")} value={pendingApprovals} icon="partners" color="blue" />
      </div>

      <ExperienceDashboardSectionsTabs experiences={experiences} />
    </div>
  );
}
