"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FacilityForm() {
  const t = useTranslations("village");
  const [isMonetizable, setIsMonetizable] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("facilities.addFacility")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("common.name")}</Label>
          <Input placeholder={t("facilities.namePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("facilities.category")}</Label>
          <select className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm">
            <option value="public">{t("facilities.categories.public")}</option>
            <option value="security">{t("facilities.categories.security")}</option>
            <option value="transportation">{t("facilities.categories.transportation")}</option>
            <option value="monetizable">{t("facilities.categories.monetizable")}</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("common.description")}</Label>
          <Textarea rows={3} placeholder={t("facilities.descriptionPlaceholder")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("villageData.address")}</Label>
          <Input placeholder={t("facilities.addressPlaceholder")} />
        </div>
        <label className="flex items-center gap-2 text-sm text-stone-700 md:col-span-2">
          <input type="checkbox" checked={isMonetizable} onChange={(e) => setIsMonetizable(e.target.checked)} />
          {t("facilities.isMonetizable")}
        </label>
        {isMonetizable ? (
          <>
            <div className="space-y-2">
              <Label>{t("facilities.rentalPrice")}</Label>
              <Input type="number" min={0} />
            </div>
            <div className="space-y-2">
              <Label>{t("facilities.capacity")}</Label>
              <Input type="number" min={0} />
            </div>
          </>
        ) : null}
        <div className="md:col-span-2 flex justify-end">
          <Button>{t("actions.saveFacility")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
