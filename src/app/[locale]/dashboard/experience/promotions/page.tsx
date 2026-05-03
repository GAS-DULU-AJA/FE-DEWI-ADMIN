"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { ExperiencePromotionCard } from "@/features/experience/components/promotion-card";
import { ExperiencePromotionForm } from "@/features/experience/components/promotion-form";
import { getExperiencePromotions, getExperiences } from "@/features/experience/utils";
import { HomepageAdRequestPanel } from "@/features/shared/components/homepage-ad-request-panel";
import type { ExperiencePromotion } from "@/features/experience/types";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

type PromotionRow = ExperiencePromotion & {
  experienceName: string;
};

export default function ExperiencePromotionsPage() {
  const t = useTranslations("experience");
  const tc = useTranslations("common");
  const promotions = getExperiencePromotions();
  const experiences = getExperiences();
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo<PromotionRow[]>(
    () =>
      promotions.map((promotion) => ({
        ...promotion,
        experienceName: experiences.find((experience) => experience.id === promotion.experienceId)?.name ?? "-",
      })),
    [experiences, promotions],
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
        id: "experienceName",
        header: t("components.experience"),
        accessorKey: "experienceName",
        sortable: true,
      },
      {
        id: "type",
        header: t("components.type"),
        accessorKey: "type",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "early_bird", label: t("promotionTypes.early_bird") },
          { value: "group_discount", label: t("promotionTypes.group_discount") },
          { value: "last_chance", label: t("promotionTypes.last_chance") },
          { value: "returning_customer", label: t("promotionTypes.returning_customer") },
          { value: "promo_code", label: t("promotionTypes.promo_code") },
          { value: "bundle", label: t("promotionTypes.bundle") },
        ],
        accessorFn: (row) => t(`promotionTypes.${row.type}`),
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "active", label: t("status.active") },
          { value: "inactive", label: t("status.inactive") },
        ],
        accessorFn: (row) => t(`status.${row.status}`),
      },
      {
        id: "discount",
        header: t("components.discount"),
        accessorFn: (row) =>
          row.discountType === "percentage"
            ? `${row.discountValue}%`
            : row.discountValue.toLocaleString("id-ID"),
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
    [t, tc],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("promotions.title")}</h1>
          <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("promotions.subtitle")}</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          {t("components.create")}
        </Button>
      </div>

      <ExperiencePromotionForm open={showForm} onOpenChange={setShowForm} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("promotions.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["name", "experienceName", "promoCode"]}
            searchPlaceholder={`${tc("search")}...`}
            pageSize={10}
            mobileCardRenderer={(row) => (
              <ExperiencePromotionCard promotion={row} experienceName={row.experienceName} />
            )}
          />
        </CardContent>
      </Card>

      <HomepageAdRequestPanel role="experience" />
    </div>
  );
}
