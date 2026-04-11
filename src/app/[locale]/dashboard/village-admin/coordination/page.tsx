"use client";

import { useTranslations } from "next-intl";
import { CoordinationInbox, VillagePageHeader } from "@/features/village";

export default function CoordinationPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("coordination.title")}
        description={t("coordination.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.coordination") },
        ]}
      />
      <CoordinationInbox />
    </div>
  );
}
