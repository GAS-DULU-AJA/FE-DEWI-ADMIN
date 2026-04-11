"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExperienceReservation } from "@/features/experience";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function ReservationActionPanel({ reservations }: { reservations: ExperienceReservation[] }) {
  const t = useTranslations("experience");
  const [reservationId, setReservationId] = useState<string>(reservations[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [refundPercent, setRefundPercent] = useState<number>(100);

  const selected = useMemo(
    () => reservations.find((item) => item.id === reservationId),
    [reservationId, reservations]
  );

  const projectedRefund = selected ? Math.round(selected.totalPrice * (refundPercent / 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("reservations.actionsTitle")}</CardTitle>
        <p className="text-xs text-stone-500">{t("reservations.actionsSubtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("reservations.selectReservation")}</Label>
          <select
            className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
            value={reservationId}
            onChange={(event) => setReservationId(event.target.value)}
          >
            {reservations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.customerName} ({item.ticketTypeName})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("reservations.cancelReason")}</Label>
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t("reservations.cancelReasonPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("reservations.refundPercent")}</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={refundPercent}
              onChange={(event) => setRefundPercent(Number(event.target.value || 0))}
            />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
          <p className="text-stone-600">{t("reservations.projectedRefund")}</p>
          <p className="text-lg font-semibold text-stone-900">{formatCurrency(projectedRefund)}</p>
          <p className="text-xs text-stone-500">{t("reservations.simulationNote")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">{t("reservations.markNoShow")}</Button>
          <Button variant="outline">{t("reservations.cancelReservation")}</Button>
          <Button>{t("reservations.processRefund")}</Button>
        </div>

        {reason ? <p className="text-xs text-stone-500">{t("reservations.reasonCaptured")}: {reason}</p> : null}
      </CardContent>
    </Card>
  );
}
