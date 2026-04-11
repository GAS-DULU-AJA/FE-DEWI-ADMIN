"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export function SmeProductForm() {
  const t = useTranslations("sme.productForm");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("name")}</Label>
          <Input placeholder={t("namePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("category")}</Label>
          <Input placeholder={t("categoryPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("price")}</Label>
          <Input type="number" min={0} />
        </div>
        <div className="space-y-2">
          <Label>{t("stock")}</Label>
          <Input type="number" min={0} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button>{t("save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
