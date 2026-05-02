import { ExperienceCalendar } from "@/features/experience/components/experience-calendar";
import { getExperiences } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceCalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const experiences = getExperiences();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("calendar.title")}</h1>
        <p className="text-sm text-on-surface/60">{t("calendar.subtitle")}</p>
      </div>
      <ExperienceCalendar experiences={experiences} />
    </div>
  );
}
