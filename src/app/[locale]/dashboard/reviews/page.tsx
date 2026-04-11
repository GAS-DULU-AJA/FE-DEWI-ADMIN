"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";

const REVIEWS = [
  {
    id: "1",
    author: "Tanaka Hiroshi",
    avatar: "",
    rating: 5,
    category: "Penginapan",
    target: "Homestay Bukit Hijau",
    comment: "Pengalaman yang luar biasa! Kamar sangat bersih, pemandangan sawah pagi hari membuat jiwa damai. Sarapan tradisionalnya enak sekali. Pasti akan kembali lagi!",
    date: "2025-04-05",
    helpful: 12,
    replied: false,
  },
  {
    id: "2",
    author: "Maria Santos",
    avatar: "",
    rating: 4,
    category: "Produk UMKM",
    target: "Kopi Robusta Lokal",
    comment: "Kopi lokalnya benar-benar khas dan lezat. Aroma sangat kuat. Pengiriman cepat dan packaging rapi. Kurang sedikit dari 5 bintang karena stoknya sering habis.",
    date: "2025-04-03",
    helpful: 8,
    replied: true,
  },
  {
    id: "3",
    author: "Budi Santoso",
    avatar: "",
    rating: 5,
    category: "Acara",
    target: "Festival Panen Raya",
    comment: "Festival yang sangat meriah! Pertunjukan seni tradisionalnya keren. Makanan yang dijual juga beragam dan murah. Anak-anak saya sangat senang.",
    date: "2025-04-01",
    helpful: 21,
    replied: false,
  },
  {
    id: "4",
    author: "Yuki Yamamoto",
    avatar: "",
    rating: 3,
    category: "Penginapan",
    target: "Homestay Bukit Hijau",
    comment: "Lokasi bagus dan suasana desa yang tenang. Namun fasilitas kamar mandi perlu diperbaiki dan WiFi kurang stabil. Pelayanan staff ramah.",
    date: "2025-03-28",
    helpful: 5,
    replied: false,
  },
];

const starAvg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

export default function UlasanPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const [filterRating, setFilterRating] = useState(0);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isHydrated && user?.role === "ACCOMMODATION") {
      router.replace("/dashboard/accommodation/reviews");
    }
  }, [isHydrated, router, user?.role]);

  if (!isHydrated) {
    return null;
  }

  if (user?.role === "ACCOMMODATION") {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-stone-500">
          Mengarahkan ke ulasan penginapan...
        </CardContent>
      </Card>
    );
  }

  const filtered = REVIEWS.filter((r) => filterRating === 0 || r.rating === filterRating);

  const handleHelpful = (id: string) => {
    setHelpfulMap((prev) => ({ ...prev, [id]: true }));
  };

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: REVIEWS.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("dashboard.reviews")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">Ulasan pengunjung dan tamu desa wisata</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1 flex flex-col items-center justify-center py-6">
          <p className="text-5xl font-extrabold text-amber-500">{starAvg}</p>
          <div className="flex items-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-4 w-4 ${i <= Math.round(Number(starAvg)) ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
            ))}
          </div>
          <p className="text-xs text-stone-400">{REVIEWS.length} ulasan</p>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="pt-4 space-y-2">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <button
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                  className="flex items-center gap-1 text-xs text-stone-500 w-14"
                >
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {star}
                </button>
                <div className="flex-1 h-2 rounded-full bg-stone-200">
                  <div
                    className={`h-2 rounded-full bg-amber-400 transition-all ${filterRating === star ? "ring-2 ring-amber-300" : ""}`}
                    style={{ width: `${REVIEWS.length ? (count / REVIEWS.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-4">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["Semua", "Penginapan", "Produk UMKM", "Acara"].map((cat) => (
          <button
            key={cat}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              cat === "Semua"
                ? "bg-emerald-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <Card key={review.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Avatar name={review.author} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{review.author}</p>
                      <p className="text-xs text-stone-400">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1 mb-2">
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600">{review.category}</span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">{review.target}</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      disabled={helpfulMap[review.id]}
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-1 text-xs transition-all ${helpfulMap[review.id] ? "text-emerald-600 font-medium" : "text-stone-400 hover:text-stone-600"}`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Membantu ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                    </button>
                    {!review.replied && (
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <MessageSquare className="h-3 w-3" />
                        Balas
                      </Button>
                    )}
                    {review.replied && (
                      <span className="text-xs text-stone-400">Sudah dibalas</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
