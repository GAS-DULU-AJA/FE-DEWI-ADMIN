"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { HomepageAdRequestPanel } from "@/features/shared/components/homepage-ad-request-panel";

type TransportPromotionRow = {
  id: string;
  campaign: string;
  route: string;
  discount: string;
  validUntil: string;
  status: "active" | "inactive";
};

const TRANSPORT_PROMOTION_ROWS: TransportPromotionRow[] = [
  {
    id: "tp-001",
    campaign: "Morning Shuttle Deal",
    route: "Terminal Desa ↔ Spot Wisata",
    discount: "15%",
    validUntil: "2026-06-30",
    status: "active",
  },
  {
    id: "tp-002",
    campaign: "Weekend Family Ride",
    route: "Homestay Cluster ↔ Market",
    discount: "20%",
    validUntil: "2026-05-30",
    status: "inactive",
  },
];

export default function TransportPromotionsPage() {
  const locale = useLocale();
  const isId = locale === "id";

  const columns = useMemo<ColumnDef<TransportPromotionRow>[]>(
    () => [
      {
        id: "campaign",
        header: isId ? "Kampanye" : "Campaign",
        accessorKey: "campaign",
        sortable: true,
      },
      {
        id: "route",
        header: isId ? "Rute" : "Route",
        accessorKey: "route",
        sortable: true,
      },
      {
        id: "discount",
        header: isId ? "Diskon" : "Discount",
        accessorKey: "discount",
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
        accessorFn: (row) => (row.status === "active" ? (isId ? "Aktif" : "Active") : isId ? "Nonaktif" : "Inactive"),
        sortable: true,
      },
    ],
    [isId, locale],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">
          {isId ? "Promo Transport" : "Transport Promotions"}
        </h1>
        <p className="mt-1 text-sm text-on-surface/60">
          {isId
            ? "Kelola promo rute transport dan ajukan penayangan ke homepage."
            : "Manage transport route promotions and submit them for homepage placement."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Daftar Promo" : "Promotion List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={TRANSPORT_PROMOTION_ROWS}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["campaign", "route", "discount"]}
            searchPlaceholder={isId ? "Cari promo transport..." : "Search transport promotions..."}
            pageSize={8}
          />
        </CardContent>
      </Card>

      <HomepageAdRequestPanel role="transport" />
    </div>
  );
}
