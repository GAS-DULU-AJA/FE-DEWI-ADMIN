"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { getExperiences } from "@/features/experience/utils";
import type { ExperienceItem } from "@/features/experience/types";

export default function ExperiencesPage() {
  const t = useTranslations("village");
  const experiences = getExperiences();
  const [status, setStatus] = useState("all");

  const list = useMemo(() => {
    if (status === "all") return experiences;
    return experiences.filter((item) => item.status === status);
  }, [status, experiences]);

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.title")}
        description={t("experiences.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences") },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/calendar">{t("breadcrumbs.calendar")}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/analytics">{t("experiences.analyticsTitle")}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/attendees">{t("experiences.attendeesTitle")}</Link></Button>
            <Button asChild><Link href="/dashboard/village-admin/experiences/add">{t("actions.addExperience")}</Link></Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {["all", "draft", "published", "ticket_sales_open", "ongoing", "completed", "cancelled"].map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-full px-3 py-1 text-xs ${status === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
          >
            {item === "all" ? t("experiences.statuses.all") : t(`experiences.statuses.${item}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((experience) => (
          <VillageExperienceCard key={experience.id} experience={experience} t={t} />
        ))}
      </div>
    </div>
  );
}

function VillageExperienceCard({ experience, t }: { experience: ExperienceItem; t: ReturnType<typeof useTranslations> }) {
  const isActive = experience.status === "published" || experience.status === "ticket_sales_open" || experience.status === "ongoing";
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{experience.name}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {t(`experiences.statuses.${experience.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-600">
        <p>{experience.shortDescription}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
          <span>{experience.locationName}</span>
          <span>{new Date(experience.scheduleStart).toLocaleDateString()}</span>
          <span>{t("experiences.bookedOf", { booked: experience.totalBookings, capacity: experience.totalCapacity })}</span>
          <span>⭐ {experience.averageRating}/5</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/village-admin/experiences/${experience.id}`}>{t("actions.viewDetail")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
