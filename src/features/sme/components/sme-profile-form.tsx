"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SmeProfile } from "@/features/sme/types";
import { useTranslations } from "next-intl";

export function SmeProfileForm({ profile }: { profile: SmeProfile }) {
  const [form, setForm] = useState(profile);
  const t = useTranslations("sme.profileForm");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("businessName")}</Label>
          <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t("businessType")}</Label>
          <Input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value as SmeProfile["businessType"] })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("storeAddress")}</Label>
          <Input value={form.locationAddress} onChange={(e) => setForm({ ...form, locationAddress: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t("bankName")}</Label>
          <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{t("bankAccountNumber")}</Label>
          <Input value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button>{t("save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
