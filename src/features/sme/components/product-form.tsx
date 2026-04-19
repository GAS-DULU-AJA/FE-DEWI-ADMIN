"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/form-modal";
import { useTranslations } from "next-intl";

interface SmeProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmeProductForm({ open, onOpenChange }: SmeProductFormProps) {
  const t = useTranslations("sme.productForm");

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      size="md"
      submitLabel={t("save")}
      onSubmit={() => onOpenChange(false)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
      </div>
    </FormModal>
  );
}
