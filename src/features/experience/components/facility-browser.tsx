"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FACILITY_COLORS } from "@/features/experience";
import { useTranslations } from "next-intl";

type FacilityRow = { id: string; name: string; availability: keyof typeof FACILITY_COLORS; price: number };

export function FacilityBrowser({ facilities }: { facilities: FacilityRow[] }) {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.facilityBrowser")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {facilities.map((facility) => (
          <div key={facility.id} className="flex items-center justify-between rounded-lg border border-stone-200 p-3 text-sm">
            <div>
              <p className="font-medium text-stone-900">{facility.name}</p>
              <p className="text-stone-500">{facility.price.toLocaleString("id-ID")}</p>
            </div>
            <Badge className={FACILITY_COLORS[facility.availability]}>{t(`availability.${facility.availability}`)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
