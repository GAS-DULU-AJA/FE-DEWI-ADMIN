"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ExperienceReservation } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function QRCheckInScanner({ reservations }: { reservations: ExperienceReservation[] }) {
  const t = useTranslations("experience");
  const [qrInput, setQrInput] = useState("");
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error" | "already_checked" | null;
    reservation?: ExperienceReservation;
    message: string;
  }>({ status: null, message: "" });
  const [recentScans, setRecentScans] = useState<Array<{ name: string; time: string; status: string }>>([]);

  const handleScan = () => {
    if (!qrInput.trim()) return;

    const found = reservations.find((r) => r.qrCode === qrInput.trim());
    if (!found) {
      setScanResult({ status: "error", message: t("qrScanner.invalidCode") });
      return;
    }
    if (found.bookingStatus === "checked_in") {
      setScanResult({ status: "already_checked", reservation: found, message: t("qrScanner.alreadyChecked") });
      return;
    }
    if (found.bookingStatus === "cancelled") {
      setScanResult({ status: "error", reservation: found, message: t("qrScanner.cancelledTicket") });
      return;
    }
    setScanResult({ status: "success", reservation: found, message: t("qrScanner.checkInSuccess") });
    setRecentScans((prev) => [
      { name: found.customerName, time: new Date().toLocaleTimeString(), status: "checked_in" },
      ...prev.slice(0, 9),
    ]);
    setQrInput("");
  };

  const checkedCount = reservations.filter((r) => r.bookingStatus === "checked_in").length;
  const totalCount = reservations.filter((r) => r.bookingStatus !== "cancelled").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("qrScanner.title")}</CardTitle>
        <p className="text-xs text-on-surface/60">
          {t("qrScanner.progress", { checked: checkedCount, total: totalCount })}
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-full rounded-full bg-primary/100 transition-all"
            style={{ width: `${totalCount === 0 ? 0 : (checkedCount / totalCount) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={t("qrScanner.enterCode")}
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            className="flex-1"
          />
          <Button onClick={handleScan}>{t("qrScanner.scan")}</Button>
        </div>

        {scanResult.status && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              scanResult.status === "success"
                ? "border-primary/200 bg-primary/10 text-primary"
                : scanResult.status === "already_checked"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                  : "border-red-500/30 bg-red-500/10 text-red-600"
            }`}
          >
            <p className="font-medium">{scanResult.message}</p>
            {scanResult.reservation && (
              <p className="mt-1">
                {scanResult.reservation.customerName} — {scanResult.reservation.ticketTypeName} ×{scanResult.reservation.quantity}
              </p>
            )}
          </div>
        )}

        {recentScans.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-on-surface/60">{t("qrScanner.recentScans")}</p>
            {recentScans.map((scan, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-surface-container-high p-2 text-sm">
                <span className="text-on-surface/80">{scan.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-on-surface/60">{scan.time}</span>
                  <Badge variant="default">{t("bookingStatus.checked_in")}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
