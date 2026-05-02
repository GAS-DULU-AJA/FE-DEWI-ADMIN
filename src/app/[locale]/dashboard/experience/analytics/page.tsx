import { EventAnalytics } from "@/features/experience/components/event-analytics";
import { getExperiences, getExperienceReservations } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const experiences = getExperiences();
  const reservations = getExperienceReservations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("analytics.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("analytics.subtitle")}</p>
      </div>

      <EventAnalytics experiences={experiences} reservations={reservations} />
    </div>
  );
}
