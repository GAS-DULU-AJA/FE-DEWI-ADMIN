"use client";

import { useTranslations } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { EventAnalytics } from "@/features/experience/components/event-analytics";
import { getExperiences, getExperienceReservations } from "@/features/experience/utils";

export default function VillageExperienceAnalyticsPage() {
  const t = useTranslations("village");
  const experiences = getExperiences();
  const reservations = getExperienceReservations();

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.analyticsTitle")}
        description={t("experiences.analyticsSubtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: t("experiences.analyticsTitle") },
        ]}
      />
      <EventAnalytics experiences={experiences} reservations={reservations} />
    </div>
  );
}
