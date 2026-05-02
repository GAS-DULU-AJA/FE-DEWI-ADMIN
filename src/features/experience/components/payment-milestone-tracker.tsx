"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PaymentMilestone } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function PaymentMilestoneTracker({ milestones }: { milestones: PaymentMilestone[] }) {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.paymentMilestones")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {milestones.map((item) => (
          <div key={item.milestone} className="flex items-center justify-between rounded-lg border border-surface-container-high p-3 text-sm">
            <div>
              <p className="font-medium text-on-surface">{t(`milestones.${item.milestone}`)}</p>
              <p className="text-on-surface/60">{item.percent}% · {t("components.due")}: {item.dueDate}</p>
            </div>
            <Badge variant={item.paid ? "default" : "secondary"}>{item.paid ? t("components.paid") : t("components.pending")}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
