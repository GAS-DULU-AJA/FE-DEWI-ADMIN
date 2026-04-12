"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExperienceCoordination } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function CoordinationPanel({ coordinations }: { coordinations: ExperienceCoordination[] }) {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.coordinationProposals")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {coordinations.map((item) => (
          <div key={item.id} className="rounded-lg border border-stone-200 p-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-stone-900">{item.id}</p>
              <Badge variant={item.status === "approved" ? "default" : "secondary"}>{t(`status.${item.status}`)}</Badge>
            </div>
            <p className="text-stone-600">{t("components.village")}: {item.targetVillage}</p>
            <p className="text-stone-500">{t("components.messages")}: {item.messages.length}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
