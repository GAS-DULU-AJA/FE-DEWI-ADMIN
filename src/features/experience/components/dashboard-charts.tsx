"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExperiences } from "@/features/experience";
import { useTranslations } from "next-intl";

function ProgressChart({
  title,
  subtitle,
  rows,
  valueSuffix = "",
}: {
  title: string;
  subtitle: string;
  rows: Array<{ label: string; value: number }>;
  valueSuffix?: string;
}) {
  const maxValue = rows.reduce((max, row) => Math.max(max, row.value), 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <p className="text-xs text-stone-500">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => {
          const percent = maxValue === 0 ? 0 : Math.round((row.value / maxValue) * 100);
          return (
            <div key={row.label} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-stone-600">{row.label}</span>
                <span className="font-medium text-stone-900">{row.value}{valueSuffix}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-violet-500" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function ExperienceDashboardCharts() {
  const t = useTranslations("experience");
  const experiences = getExperiences();

  const bookingRows = experiences.map((item) => ({ label: item.name, value: item.totalBookings }));
  const revenueRows = experiences.map((item) => ({ label: item.name, value: item.monthlyRevenue }));
  const ratingRows = experiences.map((item) => ({ label: item.name, value: Number(item.averageRating.toFixed(1)) }));

  const ticketDistribution = experiences
    .flatMap((item) => item.ticketTypes)
    .reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.name] = (acc[ticket.name] ?? 0) + ticket.sold;
      return acc;
    }, {});

  const ticketRows = Object.entries(ticketDistribution).map(([label, value]) => ({ label, value }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ProgressChart
        title={t("charts.bookingTrend.title")}
        subtitle={t("charts.bookingTrend.subtitle")}
        rows={bookingRows}
      />
      <ProgressChart
        title={t("charts.revenueByExperience.title")}
        subtitle={t("charts.revenueByExperience.subtitle")}
        rows={revenueRows}
      />
      <ProgressChart
        title={t("charts.ticketSalesDistribution.title")}
        subtitle={t("charts.ticketSalesDistribution.subtitle")}
        rows={ticketRows}
      />
      <ProgressChart
        title={t("charts.ratingTrend.title")}
        subtitle={t("charts.ratingTrend.subtitle")}
        rows={ratingRows}
        valueSuffix="/5"
      />
    </div>
  );
}
