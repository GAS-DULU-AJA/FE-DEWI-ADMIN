"use client";

import { useTranslations } from "next-intl";
import { TestimonialsTable } from "@/features/village/components/testimonials-table";
import { VillagePageHeader } from "@/features/village/components/page-header";

export default function TestimonialsPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("testimonials.title")}
        description={t("testimonials.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.testimonials") },
        ]}
      />
      <TestimonialsTable />
    </div>
  );
}
