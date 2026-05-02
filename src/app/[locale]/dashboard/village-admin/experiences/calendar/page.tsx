"use client";

import { useTranslations } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { getExperiences } from "@/features/experience/utils";

export default function ExperienceCalendarPage() {
  const t = useTranslations("village");
  const experiences = getExperiences();
  const eventDays = new Set(experiences.map((item) => new Date(item.scheduleStart).getDate()));

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.calendarTitle")}
        description={t("experiences.calendarSubtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: t("breadcrumbs.calendar") },
        ]}
      />
      <div className="rounded-xl border-0 bg-surface-container-lowest p-4">
        <div className="mb-3 space-y-1">
          <p className="text-sm font-medium text-on-surface">{t("experiences.calendarTitle")}</p>
          <p className="text-xs text-on-surface/60">{t("experiences.totalEvents", { count: experiences.length })}</p>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1 text-[11px] font-semibold text-on-surface/40">
              {d}
            </div>
          ))}
          {[...Array(2)].map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isEvent = eventDays.has(day);
            return (
              <div
                key={day}
                className={`rounded-md py-1.5 text-xs ${isEvent ? "bg-primary font-semibold text-white" : "text-on-surface/70 hover:bg-surface-container"}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-on-surface">{t("experiences.upcomingEvents")}</h3>
        {experiences.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between rounded-lg border-0 bg-surface-container-lowest p-3 text-sm">
            <div>
              <p className="font-medium text-on-surface">{exp.name}</p>
              <p className="text-xs text-on-surface/60">{exp.locationName} · {new Date(exp.scheduleStart).toLocaleDateString()}</p>
            </div>
            <span className="text-xs text-on-surface/60">{exp.totalBookings}/{exp.totalCapacity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
