"use client";

import { useTranslations } from "next-intl";
import { VillageDataForm, VillagePageHeader } from "@/features/village";

export default function VillageDataPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("villageData.title")}
        description={t("villageData.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.villageData") },
        ]}
      />
      <VillageDataForm />
    </div>
  );
}
