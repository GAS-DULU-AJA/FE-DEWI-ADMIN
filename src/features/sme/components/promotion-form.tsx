"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SME_PROMOTION_TYPES } from "@/features/sme/constants";
import { useTranslations } from "next-intl";

export function SmePromotionForm() {
  const [type, setType] = useState(SME_PROMOTION_TYPES[0]);
  const t = useTranslations("sme.promotions");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("formTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>{t("name")}</Label>
          <Input placeholder={t("namePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("type")}</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as (typeof SME_PROMOTION_TYPES)[number])}
            className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
          >
            {SME_PROMOTION_TYPES.map((item) => (
              <option key={item} value={item}>
                {t(`types.${item}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>{t("discountValue")}</Label>
          <Input type="number" min={0} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button>{t("create")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
