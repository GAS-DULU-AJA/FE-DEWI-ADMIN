"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { PARTNER_APPLICATIONS } from "@/features/village/mock-data";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Eye } from "lucide-react";

type PartnerRow = (typeof PARTNER_APPLICATIONS)[number];

export default function VillageAdminPartnersPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("partners.title")}
        description={t("partners.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.partners") },
        ]}
      />

      <DataTable<PartnerRow>
        data={PARTNER_APPLICATIONS}
        columns={[
          {
            id: "organization",
            header: t("partners.organizationLabel") || "Organisasi",
            accessorFn: (row) => (
              <div>
                <p className="font-medium text-stone-900">{row.organizationName}</p>
                <p className="text-xs text-stone-500">{row.ownerName}</p>
              </div>
            ),
            sortable: true,
          },
          {
            id: "role",
            header: t("partners.role") || "Peran",
            accessorFn: (row) => t(`partners.roles.${row.role}`),
            sortable: true,
            hideOnMobile: true,
          },
          {
            id: "submittedAt",
            header: t("partners.submittedAt") || "Tanggal",
            accessorKey: "submittedAt" as keyof PartnerRow,
            sortable: true,
            hideOnMobile: true,
          },
          {
            id: "completion",
            header: t("partners.completionScore") || "Kelengkapan",
            accessorFn: (row) => (
              <span className="text-sm font-medium">{row.completionScore}%</span>
            ),
            sortable: true,
            hideOnMobile: true,
          },
          {
            id: "status",
            header: "Status",
            accessorFn: (row) => (
              <Badge variant={row.status === "approved" ? "default" : "secondary"}>
                {t(`approval.statuses.${row.status}`)}
              </Badge>
            ),
            sortable: true,
          },
        ] satisfies ColumnDef<PartnerRow>[]}
        keyExtractor={(row) => row.id}
        searchPlaceholder={t("partners.searchPlaceholder") || "Cari mitra..."}
        searchableFields={["organizationName" as keyof PartnerRow, "ownerName" as keyof PartnerRow]}
        actions={(row) => [
          { label: t("partners.viewDetail") || "Lihat Detail", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
        ]}
        emptyState={{
          title: t("partners.noData") || "Tidak ada mitra",
          description: t("partners.noDataDescription") || "Belum ada pengajuan mitra.",
        }}
      />
    </div>
  );
}
