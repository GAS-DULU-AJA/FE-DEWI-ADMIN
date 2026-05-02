"use client";

import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { PromotionCard } from "@/features/accommodation/components/promotion-card";
import type { Promotion } from "@/types";
import { formatCurrency } from "@/lib/utils";

type PromotionRow = Promotion & {
  scope: string;
};

const columns: ColumnDef<PromotionRow>[] = [
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
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "expired", label: "Expired" },
    ],
  },
  {
    id: "discount",
    header: "Discount",
    accessorFn: (row) =>
      row.discountType === "percentage"
        ? `${row.discountValue}%`
        : formatCurrency(row.discountValue),
    sortable: true,
  },
  {
    id: "validTo",
    header: "Valid To",
    accessorKey: "validTo",
    sortable: true,
  },
  {
    id: "scope",
    header: "Scope",
    accessorKey: "scope",
    hideOnMobile: true,
  },
];

export function PropertyPromotionsTable({ promotions }: { promotions: Promotion[] }) {
  const rows: PromotionRow[] = promotions.map((promotion) => ({
    ...promotion,
    scope:
      promotion.applicableRoomIds === "all"
        ? "All rooms"
        : `${promotion.applicableRoomIds.length} room(s)`,
  }));

  return (
    <DataTable
      data={rows}
      columns={columns}
      keyExtractor={(row) => row.id}
      searchableFields={["name", "type", "status", "promoCode"]}
      searchPlaceholder="Search promotions..."
      pageSize={10}
      mobileCardRenderer={(row) => <PromotionCard promotion={row} />}
    />
  );
}
