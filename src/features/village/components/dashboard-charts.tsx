"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FACILITIES } from "../mock-data";

function MiniBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-on-surface/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container-high">
        <div className="h-2 rounded-full bg-primary/100" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function VillageRevenueTrendChart() {
  const t = useTranslations("village");
  const values = [58, 66, 71, 64, 79, 86];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{t("dashboard.charts.revenueTrend")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {values.map((value, index) => (
          <MiniBar key={index} value={value} label={`M-${6 - index}`} />
        ))}
      </CardContent>
    </Card>
  );
}

export function PartnerTrendChart() {
  const t = useTranslations("village");
  const values = [22, 35, 40, 47, 43, 51];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{t("dashboard.charts.partnerTrend")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {values.map((value, index) => (
          <MiniBar key={index} value={value} label={`M-${6 - index}`} />
        ))}
      </CardContent>
    </Card>
  );
}

export function FacilityUtilizationDonutLike() {
  const t = useTranslations("village");
  const avg = Math.round(
    FACILITIES.reduce((sum, facility) => sum + (facility.utilizationRate ?? 0), 0) / FACILITIES.length
  );
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{t("dashboard.charts.facilityUtilization")}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-primary/400 text-lg font-bold text-primary">
          {avg}%
        </div>
        <div className="space-y-1 text-xs text-on-surface/70">
          <p>{t("dashboard.charts.monetizableFacilities")}</p>
          <p>{t("dashboard.charts.publicFacilities")}</p>
          <p>{t("dashboard.charts.securityTransportation")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
