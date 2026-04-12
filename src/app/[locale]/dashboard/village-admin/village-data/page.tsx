"use client";

import { useTranslations } from "next-intl";
import { VillageDataForm } from "@/features/village/components/village-data-form";
import { VillagePageHeader } from "@/features/village/components/page-header";

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
