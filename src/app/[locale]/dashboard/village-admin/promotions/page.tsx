"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { HomepageAdRequestPanel } from "@/features/shared/components/homepage-ad-request-panel";

type VillagePromotionRow = {
  id: string;
  campaign: string;
  channel: string;
  validUntil: string;
  status: "active" | "inactive";
};

const VILLAGE_PROMOTION_ROWS: VillagePromotionRow[] = [
  {
    id: "vp-001",
    campaign: "Festival Desa Mingguan",
    channel: "Homepage Feature",
    validUntil: "2026-06-30",
    status: "active",
  },
  {
    id: "vp-002",
    campaign: "Paket Jelajah Desa 2H1M",
    channel: "Community Banner",
    validUntil: "2026-05-30",
    status: "inactive",
  },
];

export default function VillagePromotionsPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const t = useTranslations("village");

  const columns = useMemo<ColumnDef<VillagePromotionRow>[]>(
    () => [
      {
        id: "campaign",
        header: isId ? "Kampanye" : "Campaign",
        accessorKey: "campaign",
        sortable: true,
      },
      {
        id: "channel",
        header: isId ? "Channel" : "Channel",
        accessorKey: "channel",
        sortable: true,
      },
      {
        id: "validUntil",
        header: isId ? "Berlaku Hingga" : "Valid Until",
        accessorFn: (row) => new Date(row.validUntil).toLocaleDateString(locale),
        sortable: true,
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorFn: (row) =>
          row.status === "active" ? (isId ? "Aktif" : "Active") : isId ? "Nonaktif" : "Inactive",
        sortable: true,
      },
    ],
    [isId, locale],
  );

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={isId ? "Promosi Desa" : "Village Promotions"}
        description={
          isId
            ? "Kelola promosi desa dan ajukan materi iklan ke Super Admin."
            : "Manage village promotions and submit advertisement materials to Super Admin."
        }
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: isId ? "Promosi" : "Promotions" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Daftar Promosi Desa" : "Village Promotion List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={VILLAGE_PROMOTION_ROWS}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["campaign", "channel"]}
            searchPlaceholder={isId ? "Cari promosi desa..." : "Search village promotions..."}
            pageSize={8}
          />
        </CardContent>
      </Card>

      <HomepageAdRequestPanel role="village" />
    </div>
  );
}
