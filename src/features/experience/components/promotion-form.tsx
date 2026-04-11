"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

const TYPES = ["early_bird", "group_discount", "last_chance", "returning_customer", "promo_code", "bundle"] as const;

export function ExperiencePromotionForm() {
  const t = useTranslations("experience");
  const [type, setType] = useState<(typeof TYPES)[number]>("early_bird");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.createPromotion")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("components.name")}</Label>
          <Input placeholder={t("components.campaignNamePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("components.type")}</Label>
          <select className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm" value={type} onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}>
            {TYPES.map((item) => (
              <option key={item} value={item}>{t(`promotionTypes.${item}`)}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>{t("components.discount")}</Label>
          <Input type="number" min={0} />
        </div>
        {type === "promo_code" ? (
          <div className="space-y-2">
            <Label>{t("components.promoCode")}</Label>
            <Input placeholder={t("components.promoCodeSample")} />
          </div>
        ) : null}
        <div className="md:col-span-2 flex justify-end">
          <Button>{t("components.create")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
