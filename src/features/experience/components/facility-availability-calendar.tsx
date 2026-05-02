"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type FacilityRow = { id: string; name: string };
type FacilityReservation = { facilityId: string; date: string; hours: number };

function toYmd(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function FacilityAvailabilityCalendar({
  facilities,
  reservations,
  horizonDays = 7,
}: {
  facilities: FacilityRow[];
  reservations: FacilityReservation[];
  horizonDays?: number;
}) {
  const t = useTranslations("experience");
  const days = Array.from({ length: horizonDays }, (_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx);
    return date;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("coordination.facilityCalendarTitle")}</CardTitle>
        <p className="text-xs text-on-surface/60">{t("coordination.facilityCalendarSubtitle")}</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-surface-container-high text-left text-xs text-on-surface/60">
              <th className="px-2 py-2">{t("components.facility")}</th>
              {days.map((day) => (
                <th key={day.toISOString()} className="px-2 py-2 font-medium text-on-surface/70">
                  {day.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility) => (
              <tr key={facility.id} className="border-b border-surface-container">
                <td className="px-2 py-2 font-medium text-on-surface">{facility.name}</td>
                {days.map((day) => {
                  const dayKey = toYmd(day);
                  const match = reservations.find(
                    (item) => item.facilityId === facility.id && item.date === dayKey
                  );
                  return (
                    <td key={`${facility.id}-${dayKey}`} className="px-2 py-2">
                      {match ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {t("coordination.reservedHours", { hours: match.hours })}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {t("coordination.open")}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
