"use client";

import { useTranslations } from "next-intl";
import { VillageBalanceCard } from "@/features/village/components/village-balance-card";
import { CommissionConfigCard } from "@/features/village/components/commission-config-card";
import { VillagePageHeader } from "@/features/village/components/page-header";

export default function VillageAdminFinancePage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("withdrawal.title")}
        description={t("withdrawal.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.finance") },
        ]}
      />

      {/* Saldo Desa + Withdrawal + Riwayat Transaksi */}
      <VillageBalanceCard />

      {/* Konfigurasi Komisi & Split Payment */}
      <CommissionConfigCard />
    </div>
  );
}
