"use client";

import { useTranslations } from "next-intl";
import { ExperienceWizard, VillagePageHeader } from "@/features/village";

export default function AddExperiencePage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.addTitle")}
        description={t("experiences.addSubtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: t("breadcrumbs.create") },
        ]}
      />
      <ExperienceWizard />
    </div>
  );
}
