"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/form-modal";
import { useTranslations } from "next-intl";

const TYPES = ["early_bird", "group_discount", "last_chance", "returning_customer", "promo_code", "bundle"] as const;

interface ExperiencePromotionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExperiencePromotionForm({ open, onOpenChange }: ExperiencePromotionFormProps) {
  const t = useTranslations("experience");
  const [type, setType] = useState<(typeof TYPES)[number]>("early_bird");

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("components.createPromotion")}
      size="md"
      submitLabel={t("components.create")}
      onSubmit={() => onOpenChange(false)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
      </div>
    </FormModal>
  );
}
