"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { getExperiences } from "@/features/experience/utils";

type TemporalStatus = "upcoming" | "ongoing" | "past";

type CalendarEvent = {
  id: string;
  name: string;
  locationName: string;
  scheduleStart: string;
  scheduleEnd: string;
  totalBookings: number;
  totalCapacity: number;
  status: TemporalStatus;
  isParticipated: boolean;
};

function getTemporalStatus(start: Date, end: Date, now: Date): TemporalStatus {
  if (start > now) return "upcoming";
  if (start <= now && end >= now) return "ongoing";
  return "past";
}

export default function ExperienceCalendarPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const t = useTranslations("village");
  const experiences = getExperiences();
  const [activeMonth, setActiveMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TemporalStatus>("all");
  const [participationFilter, setParticipationFilter] = useState<"all" | "joined" | "not_joined">("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const now = new Date();
    return experiences.map((item) => {
      const scheduleStart = new Date(item.scheduleStart);
      const scheduleEnd = new Date(item.scheduleEnd);
      return {
        id: item.id,
        name: item.name,
        locationName: item.locationName,
        scheduleStart: item.scheduleStart,
        scheduleEnd: item.scheduleEnd,
        totalBookings: item.totalBookings,
        totalCapacity: item.totalCapacity,
        status: getTemporalStatus(scheduleStart, scheduleEnd, now),
        isParticipated: item.totalBookings > 0,
      };
    });
  }, [experiences]);

  const filteredEvents = useMemo(() => {
    const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const to = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return calendarEvents.filter((event) => {
      const start = new Date(event.scheduleStart);

      if (from && start < from) return false;
      if (to && start > to) return false;
      if (statusFilter !== "all" && event.status !== statusFilter) return false;
      if (participationFilter === "joined" && !event.isParticipated) return false;
      if (participationFilter === "not_joined" && event.isParticipated) return false;
      if (experienceFilter !== "all" && event.id !== experienceFilter) return false;

      return true;
    });
  }, [calendarEvents, endDate, experienceFilter, participationFilter, startDate, statusFilter]);

  const firstDayOfMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0).getDate();

  const eventsByDay = useMemo(() => {
    return filteredEvents.reduce<Record<number, CalendarEvent[]>>((acc, event) => {
      const date = new Date(event.scheduleStart);
      if (date.getMonth() !== activeMonth.getMonth() || date.getFullYear() !== activeMonth.getFullYear()) {
        return acc;
      }
      const day = date.getDate();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(event);
      return acc;
    }, {});
  }, [activeMonth, filteredEvents]);

  const nearestUpcomingId = useMemo(() => {
    const now = new Date();
    const upcoming = filteredEvents
      .filter((event) => event.status === "upcoming")
      .sort((a, b) => +new Date(a.scheduleStart) - +new Date(b.scheduleStart));

    const nearest = upcoming.find((event) => new Date(event.scheduleStart) >= now);
    return nearest?.id;
  }, [filteredEvents]);

  const incomingEvents = useMemo(() => {
    const now = new Date();
    const next14Days = new Date(now);
    next14Days.setDate(now.getDate() + 14);

    return filteredEvents
      .filter((event) => {
        const start = new Date(event.scheduleStart);
        return event.status === "upcoming" && start >= now && start <= next14Days;
      })
      .sort((a, b) => +new Date(a.scheduleStart) - +new Date(b.scheduleStart));
  }, [filteredEvents]);

  const shiftMonth = (delta: number) => {
    setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const monthLabel = activeMonth.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const statusOptions = [
    { value: "all", label: isId ? "Semua Status" : "All Statuses" },
    { value: "upcoming", label: isId ? "Mendatang" : "Upcoming" },
    { value: "ongoing", label: isId ? "Berlangsung" : "Ongoing" },
    { value: "past", label: isId ? "Sudah Lewat" : "Past" },
  ];

  const participationOptions = [
    { value: "all", label: isId ? "Semua Experience" : "All Experiences" },
    { value: "joined", label: isId ? "Sudah Diikuti" : "Participated" },
    { value: "not_joined", label: isId ? "Belum Diikuti" : "Not Participated" },
  ];

  const experienceOptions = [
    { value: "all", label: isId ? "Semua Experience" : "All Experiences" },
    ...experiences.map((item) => ({ value: item.id, label: item.name })),
  ];

  const statusLabel = (status: TemporalStatus) => {
    if (status === "upcoming") return isId ? "Mendatang" : "Upcoming";
    if (status === "ongoing") return isId ? "Berlangsung" : "Ongoing";
    return isId ? "Lewat" : "Past";
  };

  const statusBadgeClass = (status: TemporalStatus) => {
    if (status === "upcoming") return "bg-blue-100 text-blue-700";
    if (status === "ongoing") return "bg-emerald-100 text-emerald-700";
    return "bg-surface-container text-on-surface/60";
  };

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Filter Kalender" : "Calendar Filters"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Select options={statusOptions} value={statusFilter} onChange={(value) => setStatusFilter(value as "all" | TemporalStatus)} />
            <Select options={participationOptions} value={participationFilter} onChange={(value) => setParticipationFilter(value as "all" | "joined" | "not_joined")} />
            <Select options={experienceOptions} value={experienceFilter} onChange={setExperienceFilter} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">{monthLabel}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => shiftMonth(-1)}>
                {isId ? "Bulan Sebelumnya" : "Previous Month"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => shiftMonth(1)}>
                {isId ? "Bulan Berikutnya" : "Next Month"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center">
            {isId
              ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
                  <div key={d} className="py-1 text-[11px] font-semibold text-on-surface/40">
                    {d}
                  </div>
                ))
              : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-1 text-[11px] font-semibold text-on-surface/40">
                    {d}
                  </div>
                ))}

            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`blank-${index}`} className="h-14 rounded-md bg-surface-container-low" />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const dayEvents = eventsByDay[day] ?? [];
              const hasEvent = dayEvents.length > 0;
              const hasNearest = dayEvents.some((event) => event.id === nearestUpcomingId);

              return (
                <div
                  key={day}
                  className={`h-14 rounded-md border p-1 text-left text-xs ${
                    hasEvent
                      ? "border-primary/40 bg-primary/10 text-on-surface"
                      : "border-surface-container-high bg-surface-container-lowest text-on-surface/70"
                  } ${hasNearest ? "ring-2 ring-amber-400" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{day}</span>
                    {hasEvent ? <span className="text-[10px]">{dayEvents.length}</span> : null}
                  </div>
                  {hasNearest ? (
                    <p className="mt-1 truncate text-[10px] font-semibold text-amber-700">
                      {isId ? "Incoming" : "Incoming"}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Incoming Event Experience" : "Incoming Experience Events"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {incomingEvents.length === 0 ? (
            <p className="text-sm text-on-surface/60">
              {isId
                ? "Tidak ada incoming event pada 14 hari ke depan untuk filter ini."
                : "No incoming events in the next 14 days for current filters."}
            </p>
          ) : (
            incomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-primary/40 bg-primary/10 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-on-surface">{event.name}</p>
                  <Badge className={statusBadgeClass(event.status)}>{statusLabel(event.status)}</Badge>
                </div>
                <p className="mt-1 text-xs text-on-surface/70">
                  {event.locationName} · {new Date(event.scheduleStart).toLocaleString(locale)}
                </p>
                <p className="mt-1 text-xs text-on-surface/60">
                  {event.totalBookings}/{event.totalCapacity} {isId ? "slot terisi" : "slots filled"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Daftar Event Sesuai Filter" : "Filtered Event List"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredEvents.length === 0 ? (
            <p className="text-sm text-on-surface/60">{isId ? "Tidak ada event yang cocok dengan filter." : "No events matched the filters."}</p>
          ) : (
            filteredEvents
              .sort((a, b) => +new Date(a.scheduleStart) - +new Date(b.scheduleStart))
              .map((event) => (
                <div key={`list-${event.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-container-high bg-surface-container-lowest p-3">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{event.name}</p>
                    <p className="text-xs text-on-surface/60">{new Date(event.scheduleStart).toLocaleString(locale)} · {event.locationName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusBadgeClass(event.status)}>{statusLabel(event.status)}</Badge>
                    {event.isParticipated ? (
                      <Badge variant="secondary">{isId ? "Sudah Diikuti" : "Participated"}</Badge>
                    ) : null}
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
