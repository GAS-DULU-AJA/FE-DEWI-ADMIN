"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperienceItem, ExperienceReservation } from "@/features/experience/types";
import { calculateCapacityUtilization, calculateCheckInRate, calculateNoShowRate } from "@/features/experience/utils";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

function StatBlock({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${color}`}>
      <p className="text-xs text-on-surface/60">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-on-surface/70">{label}</span>
        <span className="font-medium text-on-surface">{value}/{max} ({pct}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-container">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function EventAnalytics({
  experiences,
  reservations,
}: {
  experiences: ExperienceItem[];
  reservations: ExperienceReservation[];
}) {
  const t = useTranslations("experience");

  const totalBookings = experiences.reduce((sum, e) => sum + e.totalBookings, 0);
  const totalRevenue = experiences.reduce((sum, e) => sum + e.monthlyRevenue, 0);
  const totalCapacity = experiences.reduce((sum, e) => sum + e.totalCapacity, 0);
  const totalCheckedIn = experiences.reduce((sum, e) => sum + e.totalCheckedIn, 0);
  const totalNoShow = experiences.reduce((sum, e) => sum + e.totalNoShow, 0);
  const avgRating = experiences.length === 0
    ? 0
    : experiences.reduce((sum, e) => sum + e.averageRating, 0) / experiences.length;
  const totalTicketsSold = experiences.reduce(
    (sum, e) => sum + e.ticketTypes.reduce((s, t) => s + t.sold, 0),
    0
  );

  const ticketRevenue = experiences.reduce(
    (sum, e) => sum + e.ticketTypes.reduce((s, tk) => s + tk.price * tk.sold, 0),
    0
  );

  const paymentStats = {
    success: reservations.filter((r) => r.paymentStatus === "success").length,
    pending: reservations.filter((r) => r.paymentStatus === "pending").length,
    failed: reservations.filter((r) => r.paymentStatus === "failed").length,
    refunded: reservations.filter((r) => r.paymentStatus === "refunded").length,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("analytics.overviewTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatBlock label={t("analytics.totalBookings")} value={totalBookings} color="border-violet-200" />
            <StatBlock label={t("analytics.totalRevenue")} value={formatCurrency(totalRevenue)} color="border-primary/200" />
            <StatBlock label={t("analytics.ticketsSold")} value={totalTicketsSold} color="border-blue-200" />
            <StatBlock label={t("analytics.avgRating")} value={avgRating.toFixed(1)} color="border-amber-200" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("analytics.capacityTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProgressBar
            label={t("analytics.overallUtilization")}
            value={totalBookings}
            max={totalCapacity}
            color="bg-violet-500"
          />
          {experiences.map((e) => (
            <ProgressBar
              key={e.id}
              label={e.name}
              value={e.totalBookings}
              max={e.totalCapacity}
              color="bg-blue-500"
            />
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("analytics.checkInTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgressBar
              label={t("analytics.checkInRate")}
              value={totalCheckedIn}
              max={totalBookings}
              color="bg-primary/100"
            />
            <ProgressBar
              label={t("analytics.noShowRate")}
              value={totalNoShow}
              max={totalBookings}
              color="bg-red-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("analytics.paymentTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgressBar label={t("analytics.paymentSuccess")} value={paymentStats.success} max={reservations.length} color="bg-primary/100" />
            <ProgressBar label={t("analytics.paymentPending")} value={paymentStats.pending} max={reservations.length} color="bg-amber-500" />
            <ProgressBar label={t("analytics.paymentFailed")} value={paymentStats.failed} max={reservations.length} color="bg-red-500" />
            <ProgressBar label={t("analytics.paymentRefunded")} value={paymentStats.refunded} max={reservations.length} color="bg-on-surface/30" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("analytics.revenueBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {experiences.map((e) => {
            const rev = e.ticketTypes.reduce((s, tk) => s + tk.price * tk.sold, 0);
            return (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-surface-container-high p-3 text-sm">
                <span className="font-medium text-on-surface">{e.name}</span>
                <span className="text-on-surface/80">{formatCurrency(rev)}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between rounded-lg bg-surface-container-highest p-3 text-sm text-on-surface">
            <span className="font-medium">{t("analytics.totalTicketRevenue")}</span>
            <span className="font-bold">{formatCurrency(ticketRevenue)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
