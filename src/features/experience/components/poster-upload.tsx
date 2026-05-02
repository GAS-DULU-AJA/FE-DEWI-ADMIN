"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function PosterUpload() {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.promotionalMaterial")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-on-surface/70">
        <div className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4">
          {t("components.posterPlaceholder")}
        </div>
        <div className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4">
          {t("components.bannerPlaceholder")}
        </div>
      </CardContent>
    </Card>
  );
}
