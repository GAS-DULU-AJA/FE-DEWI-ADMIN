"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VILLAGE_PROFILE, VillagePageHeader } from "@/features/village";

type WithdrawalStatus = "pending" | "completed" | "rejected";

interface WithdrawalRecord {
  id: string;
  amount: number;
  requestedAt: string;
  status: WithdrawalStatus;
}

const MOCK_HISTORY: WithdrawalRecord[] = [
  { id: "wd-1", amount: 15000000, requestedAt: "2026-03-15", status: "completed" },
  { id: "wd-2", amount: 8500000, requestedAt: "2026-04-01", status: "pending" },
];

export default function VillageAdminFinancePage() {
  const t = useTranslations("village");
  const [amount, setAmount] = useState("");
  const profile = VILLAGE_PROFILE;

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("withdrawal.title")}
        description={t("withdrawal.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.finance") },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("withdrawal.requestTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="withdrawal-amount">{t("withdrawal.amount")}</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="rounded-md border border-stone-200 bg-stone-50 p-3 text-sm space-y-1">
            <p className="font-medium text-stone-700">{t("withdrawal.bankInfo")}</p>
            <p className="text-stone-600">{profile.bankName} — {profile.bankAccountName}</p>
            <p className="text-stone-500 font-mono">{profile.bankAccountNumber}</p>
          </div>

          <p className="text-xs text-stone-400">{t("withdrawal.estimatedSettlement")}</p>

          <Button size="sm" disabled={!amount || Number(amount) <= 0}>
            {t("actions.requestWithdrawal")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("withdrawal.historyTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_HISTORY.length === 0 ? (
            <p className="text-sm text-stone-500">{t("withdrawal.noHistory")}</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {MOCK_HISTORY.map((record) => (
                <div key={record.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-stone-900">
                      IDR {record.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-stone-500">{record.requestedAt}</p>
                  </div>
                  <Badge
                    variant={
                      record.status === "completed"
                        ? "default"
                        : record.status === "rejected"
                          ? "red"
                          : "secondary"
                    }
                  >
                    {t(`withdrawal.statuses.${record.status}`)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
