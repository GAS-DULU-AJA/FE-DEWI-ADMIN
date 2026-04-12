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
        <h1 className="text-2xl font-bold text-stone-900">{t("analytics.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("analytics.subtitle")}</p>
      </div>

      <EventAnalytics experiences={experiences} reservations={reservations} />
    </div>
  );
}
