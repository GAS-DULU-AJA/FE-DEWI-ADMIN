import { StatCard } from "@/components/dashboard/stat-card";
import { ExperienceDashboardSectionsTabs } from "@/features/experience/components/experience-dashboard-sections-tabs";
import { getExperiences } from "@/features/experience/utils";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <h1 className="text-2xl font-bold text-stone-900">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-stone-200/70 bg-white/70 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        <StatCard label={t("dashboard.kpi.totalExperiences")} value={experiences.length} icon="calendar" color="violet" />
        <StatCard label={t("dashboard.kpi.totalBookings")} value={totalBookings} icon="visitors" color="emerald" />
        <StatCard label={t("dashboard.kpi.monthlyRevenue")} value={formatCurrency(totalRevenue)} icon="revenue" color="amber" />
        <StatCard label={t("dashboard.kpi.pendingApprovals")} value={pendingApprovals} icon="partners" color="blue" />
      </div>

      <ExperienceDashboardSectionsTabs experiences={experiences} />
    </div>
  );
}
