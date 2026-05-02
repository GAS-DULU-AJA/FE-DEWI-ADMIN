"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { COORDINATION_REQUESTS } from "../mock-data";
import type { CoordinationRequest, CoordinationStatus } from "../types";

export function CoordinationInbox() {
  const t = useTranslations("village");
  const router = useRouter();

  const columns = useMemo((): ColumnDef<CoordinationRequest>[] => [
    {
      id: "eventName",
      header: t("coordination.inbox"),
      accessorKey: "eventName",
      sortable: true,
    },
    {
      id: "organizerName",
      header: "Organizer",
      accessorKey: "organizerName",
      sortable: true,
    },
    {
      id: "requestedDate",
      header: "Date",
      accessorKey: "requestedDate",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "status",
      header: t("coordination.all"),
      accessorKey: "status",
      sortable: true,
      filterable: true,
      filterOptions: (["under_review", "terms_agreed", "active", "completed"] as CoordinationStatus[]).map((s) => ({
        value: s,
        label: t(`coordination.statuses.${s}`),
      })),
      accessorFn: (row) => (
        <span className="rounded-full bg-surface-container px-2 py-0.5 text-xs text-on-surface/70">
          {t(`coordination.statuses.${row.status}`)}
        </span>
      ),
    },
  ], [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("coordination.inbox")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={COORDINATION_REQUESTS}
          columns={columns}
          keyExtractor={(r) => r.id}
          searchableFields={["eventName", "organizerName"]}
          searchPlaceholder="Cari koordinasi..."
          pageSize={10}
          onRowClick={(row) => router.push(`/dashboard/village-admin/coordination/${row.id}`)}
          emptyState={{ title: "Tidak ada koordinasi" }}
          actions={(row) => [
            { label: t("coordination.openDetail"), onClick: () => router.push(`/dashboard/village-admin/coordination/${row.id}`) },
          ]}
        />
      </CardContent>
    </Card>
  );
}
