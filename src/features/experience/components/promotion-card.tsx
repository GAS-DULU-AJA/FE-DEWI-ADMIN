"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExperiencePromotion } from "@/features/experience";
import { useTranslations } from "next-intl";

export function ExperiencePromotionCard({ promotion, experienceName }: { promotion: ExperiencePromotion; experienceName?: string }) {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{promotion.name}</CardTitle>
          <Badge variant={promotion.status === "active" ? "default" : "secondary"}>{t(`status.${promotion.status}`)}</Badge>
        </div>
        {experienceName && (
          <p className="text-xs text-on-surface/60">{experienceName}</p>
        )}
      </CardHeader>
      <CardContent className="text-sm text-on-surface/70">
        <p>{t(`promotionTypes.${promotion.type}`)}</p>
        <p>{promotion.discountType === "percentage" ? `${promotion.discountValue}%` : promotion.discountValue.toLocaleString("id-ID")}</p>
      </CardContent>
    </Card>
  );
}
