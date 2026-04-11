import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "../types";

export function ExperienceCard({ experience }: { experience: Experience }) {
  const t = useTranslations("village");
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{experience.name}</CardTitle>
          <Badge variant={experience.status === "published" || experience.status === "ongoing" ? "default" : "secondary"}>
            {t(`experiences.statuses.${experience.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-stone-600">
        <p>{experience.location}</p>
        <p>{new Date(experience.startsAt).toLocaleString()}</p>
        <p>{t("experiences.bookedOf", { booked: experience.booked, capacity: experience.capacity })}</p>
      </CardContent>
    </Card>
  );
}
