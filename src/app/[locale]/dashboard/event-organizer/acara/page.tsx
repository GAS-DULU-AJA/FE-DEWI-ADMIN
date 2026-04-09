"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Pencil, Trash2, Users } from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/utils";

type EventStatus = "open" | "full" | "closed" | "completed";

type Event = {
  id: string;
  name: string;
  date: string;
  endDate: string;
  location: string;
  capacity: number;
  registered: number;
  price: number;
  status: EventStatus;
  description: string;
  category: string;
};

const INITIAL_EVENTS: Event[] = [
  { id: "1", name: "Festival Panen Raya", date: "2025-04-20", endDate: "2025-04-20", location: "Lapangan Desa", capacity: 300, registered: 215, price: 50000, status: "open", description: "Festival tahunan merayakan panen raya desa dengan berbagai pertunjukan seni budaya.", category: "Festival" },
  { id: "2", name: "Workshop Batik Tradisional", date: "2025-04-15", endDate: "2025-04-15", location: "Balai Kerajinan", capacity: 30, registered: 28, price: 150000, status: "full", description: "Belajar membuat batik tulis dengan pengrajin lokal berpengalaman.", category: "Workshop" },
  { id: "3", name: "Tur Sawah & Edukasi Tani", date: "2025-05-01", endDate: "2025-05-01", location: "Area Persawahan", capacity: 50, registered: 12, price: 75000, status: "open", description: "Tur interaktif sawah, belajar cara menanam padi secara tradisional.", category: "Tur" },
  { id: "4", name: "Pameran Produk UMKM Desa", date: "2025-03-15", endDate: "2025-03-16", location: "Balai Desa", capacity: 500, registered: 432, price: 0, status: "completed", description: "Pameran dan bazar produk unggulan UMKM desa wisata.", category: "Pameran" },
];

const statusMap: Record<EventStatus, { label: string; variant: "default" | "amber" | "red" | "secondary" }> = {
  open: { label: "Buka", variant: "default" },
  full: { label: "Penuh", variant: "red" },
  closed: { label: "Ditutup", variant: "amber" },
  completed: { label: "Selesai", variant: "secondary" },
};

const categories = ["Semua", "Festival", "Workshop", "Tur", "Pameran"];

export default function AcaraPage() {
  const t = useTranslations();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filtered = events.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Semua" || e.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("events.title")}</h1>
          <p className="mt-0.5 text-sm text-stone-500">Kelola agenda acara dan kegiatan desa</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {t("events.add")}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Acara", value: events.length, color: "bg-violet-50 text-violet-700 border-violet-100" },
          { label: "Buka", value: events.filter((e) => e.status === "open").length, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Penuh", value: events.filter((e) => e.status === "full").length, color: "bg-red-50 text-red-700 border-red-100" },
          { label: "Pendaftar", value: events.reduce((s, e) => s + e.registered, 0), color: "bg-blue-50 text-blue-700 border-blue-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Cari acara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === c
                  ? "bg-violet-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {filtered.map((event) => {
          const s = statusMap[event.status];
          const fillPct = Math.round((event.registered / event.capacity) * 100);

          return (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-stone-900">{event.name}</h3>
                      <Badge variant={s.variant}>{s.label}</Badge>
                      <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700 font-medium">{event.category}</span>
                    </div>
                    <p className="text-xs text-stone-500">{event.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateShort(event.date)}
                        {event.endDate !== event.date && ` – ${formatDateShort(event.endDate)}`}
                      </span>
                      <span>{event.location}</span>
                      <span>{event.price === 0 ? "Gratis" : formatCurrency(event.price)}/orang</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 max-w-48 rounded-full bg-stone-200">
                        <div
                          className={`h-full rounded-full transition-all ${fillPct >= 90 ? "bg-red-500" : "bg-violet-500"}`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.registered}/{event.capacity} pendaftar
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
