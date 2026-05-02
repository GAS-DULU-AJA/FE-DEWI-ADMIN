"use client";

import { useEffect, useState } from "react";
import { MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TOP_PERFORMERS, VISITOR_STATS } from "../mock-data";

// ── SSR guard ──────────────────────────────────────────────────
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  return isClient;
}

function ChartSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg bg-surface-container" />;
}

function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-3 text-center">
      <p className="text-xl font-bold text-primary">{value}</p>
      <p className="text-xs text-on-surface/60">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-on-surface/40">{sub}</p>}
    </div>
  );
}

export function VisitorCounterCard() {
  const stats = VISITOR_STATS;
  const isClient = useIsClient();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Users className="h-4 w-4 text-primary" />
        <CardTitle className="text-base">Statistik Kunjungan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <StatPill label="Bulan Ini" value={stats.totalThisMonth.toLocaleString("id-ID")} sub="wisatawan" />
          <StatPill label="Tahun Ini" value={stats.totalThisYear.toLocaleString("id-ID")} sub="wisatawan" />
          <StatPill label="Rata-rata Lama Tinggal" value={`${stats.avgDurationDays} hari`} />
          <StatPill label="Domestik" value={`${stats.domesticPercent}%`} />
          <StatPill label="Mancanegara" value={`${stats.internationalPercent}%`} />
          <StatPill label="Pengunjung Ulang" value={`${stats.repeatVisitorPercent}%`} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-on-surface/60">Tren 6 Bulan Terakhir</p>
          {isClient ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.monthlyTrend} barSize={10} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-surface-container-high" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  formatter={(v, name) => [Number(v ?? 0).toLocaleString("id-ID"), name === "domestic" ? "Domestik" : "Mancanegara"]}
                />
                <Bar dataKey="domestic" fill="var(--color-primary)" radius={[3, 3, 0, 0]} name="domestic" />
                <Bar dataKey="international" fill="var(--color-primary)" opacity={0.35} radius={[3, 3, 0, 0]} name="international" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartSkeleton />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DemographicsCard() {
  const { demographics } = VISITOR_STATS;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <MapPin className="h-4 w-4 text-primary" />
        <CardTitle className="text-base">Asal Wisatawan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {demographics.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-on-surface">{item.city}</span>
              <span className="text-on-surface/60">{item.count.toLocaleString("id-ID")} ({item.percentage}%)</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
        <p className="pt-1 text-xs text-on-surface/40">
          Berdasarkan data profil pembeli pada periode berjalan.
        </p>
      </CardContent>
    </Card>
  );
}

const TYPE_LABEL: Record<string, string> = {
  experience: "Experience",
  accommodation: "Penginapan",
  sme: "UMKM",
};

export function TopPerformersTable() {
  const performers = TOP_PERFORMERS;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <CardTitle className="text-base">Top Performer Mitra</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-surface-container">
          {performers.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-surface">{p.name}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-on-surface/60">
                  <span className="rounded-full bg-surface-container px-1.5 py-0.5">{TYPE_LABEL[p.type]}</span>
                  <span>{p.bookings} booking</span>
                  <span>★ {p.rating}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-on-surface">{formatCurrency(p.revenue)}</p>
                <div className={`mt-0.5 flex items-center justify-end gap-0.5 text-xs font-medium ${p.trend === "up" ? "text-emerald-600" : p.trend === "down" ? "text-red-500" : "text-on-surface/50"}`}>
                  {p.trend === "up" ? <TrendingUp className="h-3 w-3" /> : p.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                  {p.trend !== "stable" && `${p.trendPercent}%`}
                  {p.trend === "stable" && "stabil"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
