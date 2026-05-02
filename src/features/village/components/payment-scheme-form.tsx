"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SCHEME_ROWS = [
  { milestoneKey: "downPayment", percent: 30, timingKey: "uponApproval" },
  { milestoneKey: "secondPayment", percent: 40, timingKey: "sevenDaysBefore" },
  { milestoneKey: "finalPayment", percent: 30, timingKey: "dayOfEvent" },
] as const;

export function PaymentSchemeForm() {
  const t = useTranslations("village");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("coordination.paymentScheme.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <table className="w-full text-sm">
          <thead className="border-b border-surface-container-high text-left text-xs text-on-surface/60">
            <tr>
              <th className="py-2">{t("coordination.paymentScheme.milestone")}</th>
              <th className="py-2">{t("coordination.paymentScheme.percent")}</th>
              <th className="py-2">{t("coordination.paymentScheme.timing")}</th>
            </tr>
          </thead>
          <tbody>
            {SCHEME_ROWS.map((row) => (
              <tr key={row.milestoneKey} className="border-b border-surface-container">
                <td className="py-2 text-on-surface">{t(`coordination.paymentScheme.${row.milestoneKey}`)}</td>
                <td className="py-2 text-on-surface/70">{row.percent}%</td>
                <td className="py-2 text-on-surface/70">{t(`coordination.paymentScheme.${row.timingKey}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant="outline">{t("coordination.paymentScheme.update")}</Button>
      </CardContent>
    </Card>
  );
}
