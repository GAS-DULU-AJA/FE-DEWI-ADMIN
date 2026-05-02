"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { ExperienceCoordination } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function CoordinationPanel({ coordinations }: { coordinations: ExperienceCoordination[] }) {
  const t = useTranslations("experience");
  const tc = useTranslations("common");

  const columns = useMemo<ColumnDef<ExperienceCoordination>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
        sortable: true,
      },
      {
        id: "targetVillage",
        header: t("components.village"),
        accessorKey: "targetVillage",
        sortable: true,
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "proposal_sent", label: t("status.proposal_sent") },
          { value: "under_review", label: t("status.under_review") },
          { value: "changes_requested", label: t("status.changes_requested") },
          { value: "facility_reserved", label: t("status.facility_reserved") },
          { value: "terms_agreed", label: t("status.terms_agreed") },
          { value: "approved", label: t("status.approved") },
          { value: "rejected", label: t("status.rejected") },
          { value: "completed", label: t("status.completed") },
        ],
        accessorFn: (row) => (
          <Badge variant={row.status === "approved" ? "default" : "secondary"}>
            {t(`status.${row.status}`)}
          </Badge>
        ),
      },
      {
        id: "messages",
        header: t("components.messages"),
        accessorKey: "messages",
        accessorFn: (row) => String(row.messages.length),
      },
    ],
    [t],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.coordinationProposals")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={coordinations}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchableFields={["id", "targetVillage"]}
          pageSize={10}
          emptyState={{
            title: t("components.noCoordinations"),
          }}
          mobileCardRenderer={(row) => (
            <Card>
              <CardContent className="space-y-1 pt-4 text-sm text-on-surface/70">
                <p className="font-semibold text-on-surface">{row.id}</p>
                <p>{t("components.village")}: {row.targetVillage}</p>
                <Badge variant={row.status === "approved" ? "default" : "secondary"}>
                  {t(`status.${row.status}`)}
                </Badge>
                <p>{t("components.messages")}: {row.messages.length}</p>
              </CardContent>
            </Card>
          )}
        />
      </CardContent>
    </Card>
  );
}
