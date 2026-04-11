import { ExperienceCalendar, getExperiences } from "@/features/experience";
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
        <h1 className="text-2xl font-bold text-stone-900">{t("calendar.title")}</h1>
        <p className="text-sm text-stone-500">{t("calendar.subtitle")}</p>
      </div>
      <ExperienceCalendar experiences={experiences} />
    </div>
  );
}
