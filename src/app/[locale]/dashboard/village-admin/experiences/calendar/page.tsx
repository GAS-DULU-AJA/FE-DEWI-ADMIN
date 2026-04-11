"use client";

import { useTranslations } from "next-intl";
import { ExperienceCalendar, VillagePageHeader } from "@/features/village";

export default function ExperienceCalendarPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.calendarTitle")}
        description={t("experiences.calendarSubtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: t("breadcrumbs.calendar") },
        ]}
      />
      <ExperienceCalendar />
    </div>
  );
}
