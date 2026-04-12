"use client";

import { useTranslations } from "next-intl";
import { ApprovalPanel } from "@/features/village/components/approval-panel";
import { VillagePageHeader } from "@/features/village/components/page-header";

export default function ApprovalPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("approval.title")}
        description={t("approval.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.approval") },
        ]}
      />
      <ApprovalPanel />
    </div>
  );
}
