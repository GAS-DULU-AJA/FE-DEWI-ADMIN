"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROMOTION_TYPES } from "@/features/accommodation";
import type { PromotionType } from "@/types";

export function PromotionForm() {
  const [type, setType] = useState<PromotionType>(PROMOTION_TYPES[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Promotion</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Promotion name" />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <select value={type} onChange={(e) => setType(e.target.value as (typeof PROMOTION_TYPES)[number])} className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm">
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
          <select className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm">
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
        <div className="md:col-span-2 flex justify-end">
          <Button>Create Promotion</Button>
        </div>
      </CardContent>
    </Card>
  );
}
