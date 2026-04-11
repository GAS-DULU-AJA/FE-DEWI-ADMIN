"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItineraryItem } from "@/features/experience";
import { useTranslations } from "next-intl";

export function ItineraryBuilder({ items }: { items: ItineraryItem[] }) {
  const t = useTranslations("experience");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.itinerary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.time}-${index}`} className="rounded-lg border border-stone-200 p-3 text-sm">
            <p className="font-medium text-stone-900">
              {item.time}{item.endTime ? ` - ${item.endTime}` : ""}
            </p>
            <p className="text-stone-700">{item.activity}</p>
            {item.location ? <p className="text-stone-500">{item.location}</p> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
