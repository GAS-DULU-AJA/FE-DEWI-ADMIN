"use client";

import { useTranslations } from "next-intl";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, XCircle, Clock, Building2, Users, TrendingUp, BarChart3 } from "lucide-react";
import { APPROVAL_STATUS_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

const PENDING_APPROVALS = [
  { id: "1", productName: "Kain Batik Mega Mendung", partnerName: "Batik Nusantara", type: "UMKM", submittedAt: "2025-04-06", category: "Kerajinan" },
  { id: "2", productName: "Kamar Deluxe View Sawah", partnerName: "Homestay Bukit Hijau", type: "Penginapan", submittedAt: "2025-04-07", category: "Penginapan" },
  { id: "3", productName: "Festival Seni Budaya Desa", partnerName: "Nusantara Events", type: "Event", submittedAt: "2025-04-07", category: "Acara" },
];

const REGISTERED_PARTNERS = [
  { id: "1", name: "Homestay Bukit Hijau", type: "Penginapan", status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "Batik Nusantara", type: "UMKM", status: "active", joinDate: "2024-02-01" },
  { id: "3", name: "Nusantara Events", type: "Event Organizer", status: "active", joinDate: "2024-02-15" },
  { id: "4", name: "Warung Makan Bu Sri", type: "UMKM", status: "active", joinDate: "2024-03-01" },
];

export default function PengelolaDesaDashboard() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("partner.villageAdmin")}</h1>
          <p className="text-sm text-stone-500 mt-0.5">Desa Wisata Sari Alam — Ringkasan bulan April 2025</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
          <Building2 className="h-5 w-5 text-emerald-700" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("dashboard.totalPartners")} value={4} change={25} icon="users" color="emerald" />
        <StatCard label={t("dashboard.totalVisitors")} value="1.240" change={12} icon="star" color="blue" />
        <StatCard label={t("dashboard.pendingApproval")} value={3} icon="approval" color="amber" />
        <StatCard label={t("dashboard.totalRevenue")} value="Rp 42,5jt" change={8} icon="revenue" color="rose" />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Approval Queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                {t("approval.queue")}
                <Badge variant="amber">{PENDING_APPROVALS.length}</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">Lihat Semua</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {PENDING_APPROVALS.map((item) => (
              <div key={item.id} className="flex items-start justify-between rounded-xl bg-amber-50 border border-amber-100 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{item.productName}</p>
                  <p className="text-xs text-stone-500">{item.partnerName} · {item.category}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{formatDate(item.submittedAt)}</p>
                </div>
                <div className="flex gap-1.5 ml-2 shrink-0">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                    <CheckSquare className="h-4 w-4" />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Registered Partners */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Mitra Terdaftar
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">Kelola</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {REGISTERED_PARTNERS.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-800 truncate">{p.name}</p>
                    <p className="text-xs text-stone-500">{p.type} · {formatDate(p.joinDate)}</p>
                  </div>
                  <span className={APPROVAL_STATUS_COLORS.approved + " rounded-full px-2 py-0.5 text-xs font-medium"}>
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mini Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            Ringkasan Analitik Desa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Rating Rata-rata", value: "4.7★", color: "text-amber-600" },
              { label: "Ulasan Bulan Ini", value: "86", color: "text-blue-600" },
              { label: "Tingkat Hunian", value: "78%", color: "text-emerald-600" },
              { label: "Acara Bulan Ini", value: "3", color: "text-violet-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-stone-50 border border-stone-100 p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="mt-1 text-xs text-stone-500">{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
