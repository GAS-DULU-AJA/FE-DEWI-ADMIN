"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCOMMODATIONS,
  AccommodationPageHeader,
  getAllAccommodationReviews,
} from "@/features/accommodation";
import { Star } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

export default function PenginapanUlasanPage() {
  const searchParams = useSearchParams();
  const presetAccommodationId = searchParams.get("accommodationId") ?? "all";

  const [selectedAccommodationId, setSelectedAccommodationId] = useState(presetAccommodationId);
  const [selectedRating, setSelectedRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [query, setQuery] = useState("");

  const reviews = getAllAccommodationReviews();

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesAccommodation =
        selectedAccommodationId === "all" || review.targetId === selectedAccommodationId;
      const matchesRating = selectedRating === 0 || review.rating === selectedRating;
      const accommodation = ACCOMMODATIONS.find((item) => item.id === review.targetId);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [review.reviewerName, review.comment, accommodation?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesAccommodation && matchesRating && matchesQuery;
    });
  }, [reviews, selectedAccommodationId, selectedRating, query]);

  const summary = useMemo(() => {
    const avgRating =
      filteredReviews.length === 0
        ? 0
        : filteredReviews.reduce((sum, review) => sum + review.rating, 0) /
          filteredReviews.length;

    return {
      total: filteredReviews.length,
      avgRating: avgRating.toFixed(1),
    };
  }, [filteredReviews]);

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Ulasan Penginapan"
        description="Seluruh ulasan kamar dan pengalaman menginap dari semua penginapan mitra."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/penginapan" },
          { label: "Ulasan" },
        ]}
        backHref="/dashboard/penginapan"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Ulasan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Penginapan</label>
            <select
              value={selectedAccommodationId}
              onChange={(event) => setSelectedAccommodationId(event.target.value)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            >
              <option value="all">Semua Penginapan</option>
              {ACCOMMODATIONS.map((accommodation) => (
                <option key={accommodation.id} value={accommodation.id}>
                  {accommodation.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Rating</label>
            <select
              value={selectedRating}
              onChange={(event) => setSelectedRating(Number(event.target.value) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            >
              <option value={0}>Semua Rating</option>
              <option value={5}>5 Bintang</option>
              <option value={4}>4 Bintang</option>
              <option value={3}>3 Bintang</option>
              <option value={2}>2 Bintang</option>
              <option value={1}>1 Bintang</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Cari ulasan</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nama tamu atau isi ulasan..."
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Ulasan</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rata-rata Rating</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">{summary.avgRating}</CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const accommodation = ACCOMMODATIONS.find((item) => item.id === review.targetId);

          return (
            <Card key={review.id}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{review.reviewerName}</CardTitle>
                <p className="text-xs text-stone-500">
                  {accommodation?.name ?? "-"} · {formatDateShort(review.createdAt)}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-stone-700">{review.comment}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-stone-500">
            Tidak ada data ulasan untuk kombinasi filter yang dipilih.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
