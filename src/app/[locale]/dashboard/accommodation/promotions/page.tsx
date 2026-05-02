"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { PromotionCard } from "@/features/accommodation/components/promotion-card";
import { PromotionForm } from "@/features/accommodation/components/promotion-form";
import {
  getAllAccommodationPromotions,
} from "@/features/accommodation/utils";
import { Plus } from "lucide-react";

type PromotionRow = ReturnType<typeof getAllAccommodationPromotions>[number] & {
  coverageCount: number;
  entityNamesDisplay: string;
};

export default function AccommodationPromotionsPage() {
  const promotions = getAllAccommodationPromotions();
  const activePromotions = promotions.filter((promotion) => promotion.status === "active");
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(promotions[0]?.id ?? null);

  const rows = useMemo<PromotionRow[]>(
    () =>
      promotions.map((promotion) => {
        const ids = promotion.applicableAccommodationIds;
        const names =
          ids === "all"
            ? ACCOMMODATIONS.map((accommodation) => accommodation.name)
            : ACCOMMODATIONS.filter((accommodation) => ids.includes(accommodation.id)).map((accommodation) => accommodation.name);

        return {
          ...promotion,
          coverageCount: names.length,
          entityNamesDisplay: names.join(", "),
        };
      }),
    [promotions],
  );

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null;

  const columns = useMemo<ColumnDef<PromotionRow>[]>(
    () => [
      {
        id: "name",
        header: "Promotion",
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "type",
        header: "Type",
        accessorKey: "type",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: "Seasonal Discount", value: "seasonal_discount" },
          { label: "Early Bird", value: "early_bird" },
          { label: "Last Minute", value: "last_minute" },
          { label: "Long Stay", value: "long_stay" },
          { label: "Bundle Package", value: "bundle_package" },
          { label: "Promo Code", value: "promo_code" },
        ],
        hideOnMobile: true,
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Expired", value: "expired" },
        ],
      },
      {
        id: "coverage",
        header: "Coverage",
        accessorFn: (row) => String(row.coverageCount),
        sortable: true,
      },
      {
        id: "period",
        header: "Period",
        accessorFn: (row) => `${row.validFrom} - ${row.validTo}`,
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [],
  );

  const actions = (row: PromotionRow): ActionItem[] => [
    {
      label: "View",
      onClick: () => setSelectedId(row.id),
    },
  ];

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Promotion Management"
        description="Manage seasonal campaigns, promo codes, and bundle offers for accommodation partners."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: "Promotions" },
        ]}
        backHref="/dashboard/accommodation"
        action={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Promotion
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Promotions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{promotions.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Promotions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">
            {activePromotions.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Covered Properties</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{ACCOMMODATIONS.length}</CardContent>
        </Card>
      </div>

      <PromotionForm open={showForm} onOpenChange={setShowForm} />

      <DataTable
        data={rows}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["name", "entityNamesDisplay", "type", "status"]}
        searchPlaceholder="Search promotions..."
        pageSize={10}
        onRowClick={(row) => setSelectedId(row.id)}
        actions={actions}
        mobileCardRenderer={(row) => (
          <div className="space-y-1">
            <p className="font-medium text-on-surface">{row.name}</p>
            <p className="text-xs text-on-surface/60">{row.status} · {row.coverageCount} properties</p>
            <p className="text-xs text-on-surface/60">{row.validFrom} - {row.validTo}</p>
          </div>
        )}
      />

      {selected ? (
        <PromotionCard
          promotion={selected}
          entityNames={selected.entityNamesDisplay ? selected.entityNamesDisplay.split(", ") : []}
        />
      ) : null}
    </div>
  );
}