"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { VILLAGE_PROFILE } from "@/features/village/mock-data";
import { maskBankAccount } from "@/features/village/utils";
import type { VillageProfile } from "@/features/village/types";

export default function BankAccountPage() {
  const t = useTranslations("village");
  const [form, setForm] = useState<Pick<VillageProfile, "taxId" | "bankAccountName" | "bankName" | "bankAccountNumber">>({
    taxId: VILLAGE_PROFILE.taxId ?? "",
    bankAccountName: VILLAGE_PROFILE.bankAccountName,
    bankName: VILLAGE_PROFILE.bankName,
    bankAccountNumber: VILLAGE_PROFILE.bankAccountNumber,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("villageData.bankTitle")}
        description={t("villageData.bankSubtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.bankAccount") },
        ]}
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("villageData.bankTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠ {t("villageData.bankWarning")}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t("villageData.taxId")}</Label>
              <Input
                placeholder={t("villageData.taxIdPlaceholder")}
                value={form.taxId ?? ""}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("villageData.bankAccountName")}</Label>
                <Input
                  value={form.bankAccountName}
                  onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("villageData.bankName")}</Label>
                <Input
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("villageData.bankAccountNumber")}</Label>
                <Input
                  value={form.bankAccountNumber}
                  onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("villageData.maskedPreview")}</Label>
                <Input disabled value={maskBankAccount(form.bankAccountNumber)} className="font-mono" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={handleSave}>
                {saved ? `✓ ${t("villageData.saved")}` : t("actions.updateBank")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
