"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PARTNER_APPLICATIONS } from "@/features/village/mock-data";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Eye } from "lucide-react";

type PartnerRow = (typeof PARTNER_APPLICATIONS)[number];

export default function VillageAdminPartnersPage() {
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const router = useRouter();

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<PartnerRow>
            data={PARTNER_APPLICATIONS}
            columns={[
              {
                id: "organization",
                header: t("partners.organizationLabel"),
                accessorFn: (row) => (
                  <div>
                    <p className="font-medium text-on-surface">{row.organizationName}</p>
                    <p className="text-xs text-on-surface/60">{row.ownerName}</p>
                  </div>
                ),
                sortable: true,
              },
              {
                id: "role",
                header: t("partners.role"),
                accessorFn: (row) => t(`partners.roles.${row.role}`),
                sortable: true,
                hideOnMobile: true,
              },
              {
                id: "submittedAt",
                header: t("partners.submittedAt"),
                accessorKey: "submittedAt" as keyof PartnerRow,
                sortable: true,
                hideOnMobile: true,
              },
              {
                id: "completion",
                header: t("partners.completionScore"),
                accessorFn: (row) => (
                  <span className="text-sm font-medium">{row.completionScore}%</span>
                ),
                sortable: true,
                hideOnMobile: true,
              },
              {
                id: "status",
                header: tc("status"),
                accessorFn: (row) => (
                  <Badge variant={row.status === "approved" ? "default" : "secondary"}>
                    {t(`approval.statuses.${row.status}`)}
                  </Badge>
                ),
                sortable: true,
              },
            ] satisfies ColumnDef<PartnerRow>[]}
            keyExtractor={(row) => row.id}
            onRowClick={(row) => router.push(`/dashboard/village-admin/partners/${row.id}`)}
            searchPlaceholder={t("partners.searchPlaceholder")}
            searchableFields={["organizationName" as keyof PartnerRow, "ownerName" as keyof PartnerRow]}
            actions={(row) => [
              {
                label: t("partners.viewDetail"),
                icon: <Eye className="h-4 w-4" />,
                onClick: () => router.push(`/dashboard/village-admin/partners/${row.id}`),
              },
            ]}
            emptyState={{
              title: t("partners.noData"),
              description: t("partners.noDataDescription"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
