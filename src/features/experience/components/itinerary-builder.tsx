"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItineraryItem, Speaker } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function ItineraryBuilder({
  items,
  speakers = [],
}: {
  items: ItineraryItem[];
  speakers?: Speaker[];
}) {
  const t = useTranslations("experience");
  const speakersById = new Map(speakers.map((speaker) => [speaker.id, speaker]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.itinerary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.time}-${index}`} className="rounded-lg border border-surface-container-high p-3 text-sm">
            <p className="font-medium text-on-surface">
              {item.time}{item.endTime ? ` - ${item.endTime}` : ""}
            </p>
            <p className="text-on-surface/80">{item.activity}</p>
            {item.location ? <p className="text-on-surface/60">{item.location}</p> : null}
            {item.speakerId && speakersById.get(item.speakerId) ? (
              <p className="text-on-surface/60">
                {t("speakers.title")}: {speakersById.get(item.speakerId)?.name}
              </p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
