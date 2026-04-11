"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VILLAGE_PROFILE } from "../mock-data";
import { maskBankAccount } from "../utils";

export function VillageDataForm() {
  const t = useTranslations("village");
  const [form, setForm] = useState(VILLAGE_PROFILE);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("villageData.profileTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("villageData.villageName")}</Label>
            <Input value={form.villageName} onChange={(e) => setForm({ ...form, villageName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.contactPhone")}</Label>
            <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>{t("villageData.address")}</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>{t("villageData.description")}</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>{t("villageData.history")}</Label>
            <Textarea
              rows={3}
              value={form.history}
              onChange={(e) => setForm({ ...form, history: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.latitude")}</Label>
            <Input type="number" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.longitude")}</Label>
            <Input type="number" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.contactEmail")}</Label>
            <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.website")}</Label>
            <Input value={form.website ?? ""} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button>{t("actions.saveProfile")}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("villageData.bankTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("villageData.bankAccountName")}</Label>
            <Input value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.bankName")}</Label>
            <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.bankAccountNumber")}</Label>
            <Input value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t("villageData.maskedPreview")}</Label>
            <Input disabled value={maskBankAccount(form.bankAccountNumber)} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button variant="outline">{t("actions.updateBank")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
