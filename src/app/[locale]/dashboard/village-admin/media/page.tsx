"use client";

import { useTranslations } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { MediaUpload } from "@/features/village/components/media-upload";

export default function VillageMediaPage() {
  const t = useTranslations("village");
  const tn = useTranslations("nav");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={tn("media")}
        description={t("media.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: tn("media") },
        ]}
      />

      <MediaUpload />
    </div>
  );
}
