"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DayOfWeek, DaySchedule, OperatingHoursSchedule } from "../types";

const DAYS: DayOfWeek[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

const DEFAULT_SCHEDULE: OperatingHoursSchedule = Object.fromEntries(
  DAYS.map((day) => [day, { enabled: true, is24Hours: true }]),
) as OperatingHoursSchedule;

function parseSchedule(value?: string | OperatingHoursSchedule): OperatingHoursSchedule {
  if (!value) return DEFAULT_SCHEDULE;
  if (typeof value === "object") return value;
  // Legacy string → default schedule
  return DEFAULT_SCHEDULE;
}

interface OperatingHoursEditorProps {
  value?: string | OperatingHoursSchedule;
  onChange: (schedule: OperatingHoursSchedule) => void;
}

export function OperatingHoursEditor({ value, onChange }: OperatingHoursEditorProps) {
  const t = useTranslations("village.villageData.operatingHours");
  const tDays = useTranslations("village.villageData.days");
  const schedule = parseSchedule(value);

  function update(day: DayOfWeek, patch: Partial<DaySchedule>) {
    onChange({ ...schedule, [day]: { ...schedule[day], ...patch } });
  }

  return (
    <div className="space-y-2">
      {DAYS.map((day) => {
        const s = schedule[day];
        return (
          <div key={day} className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2">
            {/* Day name + enable toggle */}
            <button
              type="button"
              onClick={() => update(day, { enabled: !s.enabled })}
              className="flex items-center gap-2 min-w-[120px]"
            >
              <span
                className={cn(
                  "inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                  s.enabled ? "bg-primary/100" : "bg-surface-container-highest",
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full bg-surface-container-lowest shadow transition-transform",
                    s.enabled ? "translate-x-4" : "translate-x-0.5",
                  )}
                />
              </span>
              <span className={cn("text-sm font-medium", !s.enabled && "text-muted-foreground")}>
                {tDays(day)}
              </span>
            </button>

            {s.enabled && (
              <>
                {/* 24h toggle */}
                <button
                  type="button"
                  onClick={() => update(day, { is24Hours: !s.is24Hours })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    s.is24Hours
                      ? "border-primary/500 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("is24Hours")}
                </button>

                {/* Time inputs when not 24h */}
                {!s.is24Hours && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={s.openTime ?? "08:00"}
                      onChange={(e) => update(day, { openTime: e.target.value })}
                      className="h-8 w-28 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">—</span>
                    <Input
                      type="time"
                      value={s.closeTime ?? "17:00"}
                      onChange={(e) => update(day, { closeTime: e.target.value })}
                      className="h-8 w-28 text-xs"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
