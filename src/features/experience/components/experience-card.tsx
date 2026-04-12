"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateCapacityUtilization } from "@/features/experience/utils";
import type { ExperienceItem } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function ExperienceCard({ experience }: { experience: ExperienceItem }) {
  const t = useTranslations("experience");
  const utilization = calculateCapacityUtilization(experience.totalCapacity, experience.totalBookings);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{experience.name}</CardTitle>
          <Badge variant={experience.status === "ticket_sales_open" ? "default" : "secondary"}>
            {t(`status.${experience.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-stone-600">
        <p>{experience.shortDescription}</p>
        <p>{experience.locationName}</p>
        <p>{t("components.bookings")}: {experience.totalBookings}/{experience.totalCapacity} ({utilization}%)</p>
      </CardContent>
    </Card>
  );
}
