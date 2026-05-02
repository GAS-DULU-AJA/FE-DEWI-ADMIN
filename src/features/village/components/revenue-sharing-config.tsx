"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_REVENUE_SHARING } from "../constants";

export function RevenueSharingConfig() {
  const t = useTranslations("village");
  const [organizer, setOrganizer] = useState(DEFAULT_REVENUE_SHARING.organizer);
  const [village, setVillage] = useState(DEFAULT_REVENUE_SHARING.village);
  const platform = DEFAULT_REVENUE_SHARING.platform;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("coordination.revenueSharing.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-on-surface/60">{t("coordination.revenueSharing.organizer")}</span>
            <input
              type="number"
              min={0}
              max={100}
              value={organizer}
              onChange={(e) => setOrganizer(Number(e.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-surface-container-high px-3"
            />
          </label>
          <label className="space-y-1">
            <span className="text-on-surface/60">{t("coordination.revenueSharing.village")}</span>
            <input
              type="number"
              min={0}
              max={100}
              value={village}
              onChange={(e) => setVillage(Number(e.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-surface-container-high px-3"
            />
          </label>
          <label className="space-y-1">
            <span className="text-on-surface/60">{t("coordination.revenueSharing.platformFixed")}</span>
            <input
              type="number"
              value={platform}
              disabled
              className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container px-3"
            />
          </label>
        </div>
        <p className="text-xs text-on-surface/60">{t("coordination.revenueSharing.total", { percent: organizer + village + platform })}</p>
        <Button>{t("coordination.revenueSharing.save")}</Button>
      </CardContent>
    </Card>
  );
}
