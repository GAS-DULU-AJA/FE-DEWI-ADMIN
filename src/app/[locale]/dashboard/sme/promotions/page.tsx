"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmePromotionCard } from "@/features/sme/components/promotion-card";
import { SmePromotionForm } from "@/features/sme/components/promotion-form";
import { getSmePromotions, getSmeProducts } from "@/features/sme/utils";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

export default function SmePromotionsPage() {
  const t = useTranslations("sme.promotions");
  const promotions = getSmePromotions();
  const products = getSmeProducts();
  const [showForm, setShowForm] = useState(false);

  const getProductNames = (ids: string[] | "all") => {
    if (ids === "all") return products.map((p) => p.name);
    return products.filter((p) => ids.includes(p.id)).map((p) => p.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-stone-500">
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
          <CardContent className="text-2xl font-semibold text-stone-900">{promotions.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.active")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-700">
            {promotions.filter((promotion) => promotion.status === "active").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.withPromoCode")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">
            {promotions.filter((promotion) => promotion.promoCode).length}
          </CardContent>
        </Card>
      </div>

      <SmePromotionForm open={showForm} onOpenChange={setShowForm} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => (
          <SmePromotionCard key={promotion.id} promotion={promotion} productNames={getProductNames(promotion.applicableProductIds)} />
        ))}
      </div>
    </div>
  );
}
