"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { detectScheduleConflicts } from "@/features/experience/utils";
import type { ExperienceItem } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function ExperienceCalendar({ experiences }: { experiences: ExperienceItem[] }) {
  const t = useTranslations("experience");
  const conflicts = detectScheduleConflicts(
    experiences.map((item) => ({
      start: item.scheduleStart,
      end: item.scheduleEnd,
      facility: item.facilitiesNeeded?.[0],
    }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("calendar.overview")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {experiences.map((item) => (
          <div key={item.id} className="rounded-lg border border-surface-container-high p-3">
            <p className="font-medium text-on-surface">{item.name}</p>
            <p className="text-on-surface/70">{new Date(item.scheduleStart).toLocaleString()} - {new Date(item.scheduleEnd).toLocaleString()}</p>
          </div>
        ))}
        <p className="text-xs text-on-surface/60">{t("calendar.detectedConflicts", { count: conflicts.length })}</p>
      </CardContent>
    </Card>
  );
}
