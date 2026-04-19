"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { getExperiences, EXPERIENCE_CATEGORIES } from "@/features/experience";
import { CalendarDays, Plus, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useLocale } from "next-intl";

const statusColors: Record<string, "default" | "amber" | "blue" | "red" | "secondary"> = {
  draft: "secondary",
  proposal_sent: "blue",
  under_review: "amber",
  village_approved: "default",
  published: "default",
  rejected: "red",
  changes_requested: "amber",
};

export default function AccommodationExperiencesPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  // In real app, filter by owner === current user
  const experiences = getExperiences();

  const filtered = useMemo(() => {
    return experiences.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, experiences, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {isId ? "Kelola Experience" : "Manage Experiences"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {isId
              ? "Buat dan kelola experience yang terkait dengan penginapan Anda"
              : "Create and manage experiences related to your accommodation"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/accommodation/experiences/add">
            <Plus className="mr-2 h-4 w-4" />
            {isId ? "Tambah Experience" : "Add Experience"}
          </Link>
        </Button>
      </div>

      {/* Info card about approval */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 py-3">
          <Clock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            {isId
              ? "Experience yang Anda buat memerlukan persetujuan dari Pengelola Desa sebelum dipublikasikan."
              : "Experiences you create require Village Admin approval before being published."}
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={isId ? "Cari experience..." : "Search experiences..."}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${category === "all" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
          >
            {isId ? "Semua" : "All"}
          </button>
          {EXPERIENCE_CATEGORIES.slice(0, 5).map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${category === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1).replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-10 w-10" />}
          title={isId ? "Belum ada experience" : "No experiences yet"}
          description={
            isId
              ? "Mulai buat experience untuk menarik lebih banyak tamu"
              : "Start creating experiences to attract more guests"
          }
          action={{
            label: isId ? "Tambah Experience" : "Add Experience",
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                  <Badge variant={statusColors[item.status] || "secondary"}>
                    {item.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-stone-600 line-clamp-2">{item.shortDescription}</p>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(item.scheduleStart).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {item.status === "village_approved" || item.status === "published" ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : item.status === "rejected" ? (
                      <XCircle className="h-3 w-3 text-red-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-500" />
                    )}
                    {item.status === "village_approved" || item.status === "published"
                      ? isId ? "Disetujui" : "Approved"
                      : item.status === "rejected"
                        ? isId ? "Ditolak" : "Rejected"
                        : isId ? "Menunggu" : "Pending"}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/accommodation/experiences/${item.id}`}>
                      {isId ? "Detail" : "View Details"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
