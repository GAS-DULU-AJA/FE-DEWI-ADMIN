"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/form-modal";
import { PROMOTION_TYPES } from "@/features/accommodation";
import type { PromotionType } from "@/types";

interface PromotionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromotionForm({ open, onOpenChange }: PromotionFormProps) {
  const [type, setType] = useState<PromotionType>(PROMOTION_TYPES[0]);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Promotion"
      size="md"
      submitLabel="Create Promotion"
      onSubmit={() => onOpenChange(false)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Promotion name" />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <select value={type} onChange={(e) => setType(e.target.value as (typeof PROMOTION_TYPES)[number])} className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm">
            {PROMOTION_TYPES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Discount Value</Label>
          <Input type="number" min={0} />
        </div>
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <select className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Valid From</Label>
          <Input type="date" />
        </div>
        <div className="space-y-2">
          <Label>Valid To</Label>
          <Input type="date" />
        </div>
        {type === "promo_code" ? (
          <div className="space-y-2 md:col-span-2">
            <Label>Promo Code</Label>
            <Input placeholder="STAY10" />
          </div>
        ) : null}
      </div>
    </FormModal>
  );
}
