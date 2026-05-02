"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperienceReservation } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function CheckInManager({ reservations }: { reservations: ExperienceReservation[] }) {
  const t = useTranslations("experience");
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.checkInManager")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {reservations.map((item) => {
          const isChecked = checkedIn.includes(item.id);
          return (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-surface-container-high p-3">
              <div>
                <p className="font-medium text-on-surface">{item.customerName}</p>
                <p className="text-on-surface/60">{item.ticketTypeName}</p>
              </div>
              <Button
                variant={isChecked ? "outline" : "default"}
                size="sm"
                onClick={() => setCheckedIn((prev) => (isChecked ? prev.filter((v) => v !== item.id) : [...prev, item.id]))}
              >
                {isChecked ? t("components.checkedIn") : t("components.markCheckIn")}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
