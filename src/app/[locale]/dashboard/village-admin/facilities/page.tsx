"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { FacilityCard } from "@/features/village/components/facility-card";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";
import type { Facility } from "@/features/village/types";

type FacilityRow = Facility & {
  status: "active" | "inactive";
};

export default function FacilitiesPage() {
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { facilities, deleteFacility } = useFacilityManagementStore();

  const rows = useMemo<FacilityRow[]>(
    () => facilities.map((facility) => ({ ...facility, status: facility.utilizationRate && facility.utilizationRate > 0 ? "active" : "inactive" })),
    [facilities],
  );

  const columns = useMemo<ColumnDef<FacilityRow>[]>(
    () => [
      {
        id: "name",
        header: t("facilities.name"),
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "category",
        header: t("facilities.category"),
        accessorKey: "category",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: t("facilities.categories.public"), value: "public" },
          { label: t("facilities.categories.security"), value: "security" },
          { label: t("facilities.categories.transportation"), value: "transportation" },
          { label: t("facilities.categories.monetizable"), value: "monetizable" },
        ],
        accessorFn: (row) => t(`facilities.categories.${row.category}`),
      },
      {
        id: "status",
        header: t("facilities.status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: tc("active"), value: "active" },
          { label: tc("inactive"), value: "inactive" },
        ],
        accessorFn: (row) => (row.status === "active" ? tc("active") : tc("inactive")),
      },
      {
        id: "capacity",
        header: t("facilities.capacity"),
        accessorKey: "capacity",
        sortable: true,
        hideOnMobile: true,
        accessorFn: (row) => (row.capacity ? String(row.capacity) : "-"),
      },
    ],
    [t, tc],
  );

  const deletingFacility = deletingId ? facilities.find((item) => item.id === deletingId) : null;

  const getRowActions = (row: FacilityRow): ActionItem[] => [
    {
      label: t("actions.viewDetail"),
      onClick: () => {
        router.push(`/dashboard/village-admin/facilities/${row.id}`);
      },
    },
    {
      label: tc("edit"),
      onClick: () => {
        router.push(`/dashboard/village-admin/facilities/${row.id}/edit`);
      },
    },
    {
      label: tc("delete"),
      onClick: () => setDeletingId(row.id),
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("facilities.title")}
        description={t("facilities.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities") },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/village-admin/facilities/add">
                <Plus className="mr-1 h-4 w-4" />
                {t("facilities.addFacility")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/village-admin/facilities/reservations">
                {t("facilities.manageReservations")}
              </Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("facilities.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["name", "address"]}
            searchPlaceholder={`${tc("search")}...`}
            pageSize={10}
            actions={getRowActions}
            mobileCardRenderer={(row) => (
              <div className="space-y-2">
                <FacilityCard facility={row} />
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/village-admin/facilities/${row.id}`}>{t("actions.viewDetail")}</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/village-admin/facilities/${row.id}/edit`}>{tc("edit")}</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeletingId(row.id)}>
                    {tc("delete")}
                  </Button>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={!!deletingFacility}
        title={t("facilities.deleteConfirmTitle")}
        description={t("facilities.deleteConfirmDescription", {
          name: deletingFacility?.name || "",
        })}
        confirmText={tc("delete")}
        cancelText={tc("cancel")}
        variant="destructive"
        onConfirm={() => {
          if (deletingId) {
            deleteFacility(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
