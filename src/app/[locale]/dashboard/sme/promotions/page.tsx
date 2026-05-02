"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { SmePromotionCard } from "@/features/sme/components/promotion-card";
import { SmePromotionForm } from "@/features/sme/components/promotion-form";
import { getSmePromotions, getSmeProducts } from "@/features/sme/utils";
import type { SmePromotion } from "@/features/sme/types";
import { useLocale, useTranslations } from "next-intl";
import { Plus } from "lucide-react";

type PromotionRow = SmePromotion & {
  productsSummary: string;
};

export default function SmePromotionsPage() {
  const t = useTranslations("sme.promotions");
  const tc = useTranslations("common");
  const locale = useLocale();
  const promotions = getSmePromotions();
  const products = getSmeProducts();
  const [showForm, setShowForm] = useState(false);

  const getProductNames = (ids: string[] | "all") => {
    if (ids === "all") return products.map((p) => p.name);
    return products.filter((p) => ids.includes(p.id)).map((p) => p.name);
  };

  const formatStatus = (status: SmePromotion["status"]) => {
    if (status === "active") return tc("active");
    if (status === "inactive") return tc("inactive");
    return locale === "id" ? "Kedaluwarsa" : locale === "ja" ? "期限切れ" : "Expired";
  };

  const rows = useMemo<PromotionRow[]>(
    () =>
      promotions.map((promotion) => {
        const productNames = getProductNames(promotion.applicableProductIds);
        const productsSummary =
          productNames.length <= 2 ? productNames.join(", ") : `${productNames.length} products`;

        return {
          ...promotion,
          productsSummary,
        };
      }),
    [promotions],
  );

  const columns = useMemo<ColumnDef<PromotionRow>[]>(
    () => [
      {
        id: "name",
        header: tc("name"),
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "productsSummary",
        header: tc("details"),
        accessorKey: "productsSummary",
        sortable: true,
      },
      {
        id: "type",
        header: t("type"),
        accessorKey: "type",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "product_discount", label: t("types.product_discount") },
          { value: "category_sale", label: t("types.category_sale") },
          { value: "bundle_deal", label: t("types.bundle_deal") },
          { value: "buy_x_get_y", label: t("types.buy_x_get_y") },
          { value: "flash_sale", label: t("types.flash_sale") },
          { value: "promo_code", label: t("types.promo_code") },
          { value: "first_purchase", label: t("types.first_purchase") },
        ],
        accessorFn: (row) => t(`types.${row.type}`),
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "active", label: formatStatus("active") },
          { value: "inactive", label: formatStatus("inactive") },
          { value: "expired", label: formatStatus("expired") },
        ],
        accessorFn: (row) => formatStatus(row.status),
      },
      {
        id: "discount",
        header: t("discountValue"),
        accessorFn: (row) =>
          row.discountType === "percentage"
            ? `${row.discountValue}%`
            : row.discountValue.toLocaleString(locale),
        sortable: true,
      },
      {
        id: "validTo",
        header: tc("date"),
        accessorKey: "validTo",
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [formatStatus, locale, t, tc],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-on-surface/60">
            {t("subtitle")}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          {t("create")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.totalPromotions")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{promotions.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.active")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">
            {promotions.filter((promotion) => promotion.status === "active").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.withPromoCode")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">
            {promotions.filter((promotion) => promotion.promoCode).length}
          </CardContent>
        </Card>
      </div>

      <SmePromotionForm open={showForm} onOpenChange={setShowForm} />

      <DataTable
        data={rows}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["name", "productsSummary", "promoCode"]}
        searchPlaceholder={`${tc("search")}...`}
        pageSize={10}
        mobileCardRenderer={(row) => (
          <SmePromotionCard promotion={row} productNames={getProductNames(row.applicableProductIds)} />
        )}
      />
    </div>
  );
}
