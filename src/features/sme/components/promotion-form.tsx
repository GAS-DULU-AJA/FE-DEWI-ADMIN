"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/form-modal";
import { SME_PROMOTION_TYPES } from "@/features/sme/constants";
import { useTranslations } from "next-intl";

interface SmePromotionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmePromotionForm({ open, onOpenChange }: SmePromotionFormProps) {
  const [type, setType] = useState(SME_PROMOTION_TYPES[0]);
  const t = useTranslations("sme.promotions");

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("formTitle")}
      size="sm"
      submitLabel={t("create")}
      onSubmit={() => onOpenChange(false)}
    >
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <Label>{t("name")}</Label>
          <Input placeholder={t("namePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("type")}</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as (typeof SME_PROMOTION_TYPES)[number])}
            className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm"
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
      </div>
    </FormModal>
  );
}
