"use client";

import { useTranslations } from "next-intl";
import { SubscriptionTierCard } from "@/features/village/components/subscription-tier-card";
import { VillagePageHeader } from "@/features/village/components/page-header";

export default function VillageAdminSubscriptionPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title="Paket Langganan"
        description="Kelola paket berlangganan untuk mengoptimalkan fitur platform dan komisi transaksi."
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: "Langganan" },
        ]}
      />
      <SubscriptionTierCard />
    </div>
  );
}
