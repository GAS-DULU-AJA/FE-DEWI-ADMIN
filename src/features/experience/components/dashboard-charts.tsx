"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExperiences } from "@/features/experience/utils";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return <div style={{ height }} className="animate-pulse rounded-lg bg-stone-100" />;
}

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

const PIE_COLORS = ["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#64748b"];

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <p className="text-xs text-stone-500">{subtitle}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ExperienceDashboardCharts() {
  const isClient = useIsClient();
  const t = useTranslations("experience");
  const experiences = getExperiences();

  const bookingsByExperience = useMemo(
    () =>
      experiences.map((item) => ({
        name: item.name,
        shortName: item.name.length > 16 ? `${item.name.slice(0, 16)}...` : item.name,
        bookings: item.totalBookings,
      })),
    [experiences]
  );

  const revenueByExperience = useMemo(
    () =>
      experiences.map((item) => ({
        name: item.name,
        shortName: item.name.length > 16 ? `${item.name.slice(0, 16)}...` : item.name,
        revenue: item.monthlyRevenue,
      })),
    [experiences]
  );

  const ticketSalesDistribution = useMemo(() => {
    const grouped = experiences
      .flatMap((item) => item.ticketTypes)
      .reduce<Record<string, number>>((acc, ticket) => {
        acc[ticket.name] = (acc[ticket.name] ?? 0) + ticket.sold;
        return acc;
      }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [experiences]);

  const operationalRates = useMemo(
    () =>
      experiences.map((item) => {
        const checkInRate = item.totalBookings > 0 ? Math.round((item.totalCheckedIn / item.totalBookings) * 100) : 0;
        const noShowRate = item.totalBookings > 0 ? Math.round((item.totalNoShow / item.totalBookings) * 100) : 0;
        return {
          name: item.name,
          shortName: item.name.length > 16 ? `${item.name.slice(0, 16)}...` : item.name,
          checkInRate,
          noShowRate,
        };
      }),
    [experiences]
  );

  const lifecycleStatusData = useMemo(() => {
    const grouped = experiences.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([status, count]) => ({
      status,
      label: t(`status.${status}`),
      count,
    }));
  }, [experiences, t]);

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title={t("charts.bookingTrend.title")}
        subtitle={t("charts.bookingTrend.subtitle")}
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={bookingsByExperience} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis dataKey="shortName" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={28} />
            <Tooltip formatter={(value) => [String(value), t("dashboard.kpi.totalBookings")]} labelFormatter={(label) => String(label)} />
            <Line type="monotone" dataKey="bookings" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={t("charts.revenueByExperience.title")}
        subtitle={t("charts.revenueByExperience.subtitle")}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueByExperience} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis dataKey="shortName" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} width={38} tickFormatter={(v) => formatCompactNumber(Number(v))} />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), t("dashboard.kpi.monthlyRevenue")]} labelFormatter={(label) => String(label)} />
            <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={t("charts.ticketSalesDistribution.title")}
        subtitle={t("charts.ticketSalesDistribution.subtitle")}
      >
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={ticketSalesDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="44%"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
            >
              {ticketSalesDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", color: "#57534e" }} />
            <Tooltip formatter={(value) => [String(value), t("dashboard.kpi.totalBookings")]} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={t("charts.ratingTrend.title")}
        subtitle={t("charts.ratingTrend.subtitle")}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={operationalRates} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis dataKey="shortName" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={30} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value, name) => [
              `${value}%`,
              name === "checkInRate" ? t("charts.labels.checkInRate") : t("charts.labels.noShowRate"),
            ]} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (value === "checkInRate" ? t("charts.labels.checkIn") : t("charts.labels.noShow"))}
              wrapperStyle={{ fontSize: "11px", color: "#57534e" }}
            />
            <Bar dataKey="checkInRate" fill="#10b981" radius={[3, 3, 0, 0]} />
            <Bar dataKey="noShowRate" fill="#f59e0b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        className="lg:col-span-2"
        title={t("charts.lifecycleStatus.title")}
        subtitle={t("charts.lifecycleStatus.subtitle")}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={lifecycleStatusData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={28} />
            <Tooltip formatter={(value) => [String(value), t("charts.labels.events")]} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {lifecycleStatusData.map((entry, index) => (
                <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
