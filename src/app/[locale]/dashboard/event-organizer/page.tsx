"use client";

import { useTranslations } from "next-intl";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Ticket, Plus } from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const EVENTS = [
  {
    id: "1",
    name: "Festival Panen Raya",
    date: "2025-04-20",
    location: "Lapangan Desa",
    capacity: 300,
    registered: 215,
    price: 50000,
    status: "open",
  },
  {
    id: "2",
    name: "Workshop Batik Tradisional",
    date: "2025-04-15",
    location: "Balai Kerajinan",
    capacity: 30,
    registered: 28,
    price: 150000,
    status: "full",
  },
  {
    id: "3",
    name: "Tur Sawah & Edukasi Tani",
    date: "2025-05-01",
    location: "Area Persawahan",
    capacity: 50,
    registered: 12,
    price: 75000,
    status: "open",
  },
];

const PARTICIPANTS = [
  { id: "1", event: "Festival Panen Raya", name: "Reza Firmansyah", qty: 2, status: "paid" },
  { id: "2", event: "Workshop Batik Tradisional", name: "Linda Sari", qty: 1, status: "paid" },
  { id: "3", event: "Festival Panen Raya", name: "Tomo Nakamura", qty: 3, status: "pending" },
];

const eventStatusMap: Record<string, { label: string; variant: "default" | "amber" | "red" }> = {
  open: { label: "Buka", variant: "default" },
  full: { label: "Penuh", variant: "red" },
  closed: { label: "Ditutup", variant: "amber" },
};

const participantStatusMap: Record<string, { label: string; color: string }> = {
  paid: { label: "Lunas", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Belum Bayar", color: "bg-amber-100 text-amber-700" },
};

export default function EventOrganizerDashboard() {
  const t = useTranslations();
  const totalParticipants = EVENTS.reduce((s, e) => s + e.registered, 0);
  const totalRevenue = EVENTS.reduce((s, e) => s + e.registered * e.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("partner.eventOrganizer")}</h1>
          <p className="text-sm text-stone-500 mt-0.5">Pengelola Acara Desa — April 2025</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Tambah Acara
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("dashboard.totalEvents")} value={EVENTS.length} icon="calendar" color="violet" />
        <StatCard label="Acara Mendatang" value={2} icon="calendar" color="blue" />
        <StatCard label={t("dashboard.totalParticipants")} value={totalParticipants} icon="visitors" color="emerald" />
        <StatCard label={t("dashboard.eventRevenue")} value={formatCurrency(totalRevenue)} change={18} icon="revenue" color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-600" />
              {t("events.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {EVENTS.map((event) => {
              const s = eventStatusMap[event.status];
              const fillPct = Math.round((event.registered / event.capacity) * 100);
              return (
                <div key={event.id} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{event.name}</p>
                      <p className="text-xs text-stone-500">{formatDateShort(event.date)} · {event.location}</p>
                    </div>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-stone-200">
                      <div
                        className={`h-full rounded-full transition-all ${fillPct >= 90 ? "bg-red-500" : "bg-violet-500"}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-500">{event.registered}/{event.capacity}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{formatCurrency(event.price)}/orang</p>
                </div>
              );
            })}
            <Button variant="outline" size="sm" className="w-full mt-1">
              <Plus className="h-3 w-3" />
              {t("events.add")}
            </Button>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Pendaftar Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PARTICIPANTS.map((p) => {
              const ps = participantStatusMap[p.status];
              return (
                <div key={p.id} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                      <p className="text-xs text-stone-500">{p.event} · {p.qty} tiket</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ps.color}`}>{ps.label}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Mini Calendar Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-violet-600" />
            Jadwal Acara — April 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map((d) => (
              <div key={d} className="text-[10px] font-semibold text-stone-400 py-1">{d}</div>
            ))}
            {[...Array(2)].map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isEvent = [15, 20].includes(day);
              return (
                <div
                  key={day}
                  className={`rounded-lg py-1.5 text-xs transition-all ${
                    isEvent
                      ? "bg-violet-600 font-bold text-white"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
