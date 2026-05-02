"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";

type ReviewItem = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  category: string;
  target: string;
  comment: string;
  date: string;
  helpful: number;
  replied: boolean;
  replyText?: string;
  replyDate?: string;
};

const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    author: "Tanaka Hiroshi",
    avatar: "",
    rating: 5,
    category: "accommodation",
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
    category: "sme",
    target: "Kopi Robusta Lokal",
    comment: "Kopi lokalnya benar-benar khas dan lezat. Aroma sangat kuat. Pengiriman cepat dan packaging rapi. Kurang sedikit dari 5 bintang karena stoknya sering habis.",
    date: "2025-04-03",
    helpful: 8,
    replied: true,
    replyText: "Terima kasih atas ulasannya, Maria! Kami sedang menambah kapasitas produksi agar stok selalu tersedia.",
    replyDate: "2025-04-04",
  },
  {
    id: "3",
    author: "Budi Santoso",
    avatar: "",
    rating: 5,
    category: "experience",
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
    category: "accommodation",
    target: "Homestay Bukit Hijau",
    comment: "Lokasi bagus dan suasana desa yang tenang. Namun fasilitas kamar mandi perlu diperbaiki dan WiFi kurang stabil. Pelayanan staff ramah.",
    date: "2025-03-28",
    helpful: 5,
    replied: true,
    replyText: "Terima kasih atas masukannya, Yamamoto-san. WiFi telah kami upgrade dan kamar mandi sedang dalam proses renovasi.",
    replyDate: "2025-03-30",
  },
];

const CATEGORIES = ["all", "accommodation", "sme", "experience"] as const;

export default function UlasanPage() {
  const t = useTranslations("reviewsPage");
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const [filterRating, setFilterRating] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  if (!isHydrated) return null;

  if (user?.role === "ACCOMMODATION") {
    router.replace("/dashboard/accommodation/reviews");
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-on-surface/60">
          {t("redirecting")}
        </CardContent>
      </Card>
    );
  }

  const starAvg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const filtered = reviews.filter((r) => {
    const matchRating = filterRating === 0 || r.rating === filterRating;
    const matchCategory = filterCategory === "all" || r.category === filterCategory;
    return matchRating && matchCategory;
  });

  const handleHelpful = (id: string) => {
    setHelpfulMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, replied: true, replyText: text, replyDate: new Date().toISOString().slice(0, 10) }
          : r,
      ),
    );
    setReplyingTo(null);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const repliedCount = reviews.filter((r) => r.replied).length;
  const unrepliedCount = reviews.length - repliedCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-on-surface/60">{t("subtitle")}</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1 flex flex-col items-center justify-center py-6">
          <p className="text-5xl font-extrabold text-amber-500">{starAvg}</p>
          <div className="flex items-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-4 w-4 ${i <= Math.round(Number(starAvg)) ? "fill-amber-400 text-amber-400" : "text-on-surface/20"}`} />
            ))}
          </div>
          <p className="text-xs text-on-surface/40">{t("totalReviews", { count: reviews.length })}</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-primary">{t("replied", { count: repliedCount })}</span>
            <span className="text-amber-600">{t("unreplied", { count: unrepliedCount })}</span>
          </div>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="pt-4 space-y-2">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <button
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                  className="flex items-center gap-1 text-xs text-on-surface/60 w-14"
                >
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {star}
                </button>
                <div className="flex-1 h-2 rounded-full bg-surface-container-high">
                  <div
                    className={`h-2 rounded-full bg-amber-400 transition-all ${filterRating === star ? "ring-2 ring-amber-300" : ""}`}
                    style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface/40 w-4">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filterCategory === cat
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface/70 hover:bg-surface-container-high"
            }`}
          >
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-on-surface/60">
              {t("noReviews")}
            </CardContent>
          </Card>
        )}
        {filtered.map((review) => (
          <Card key={review.id} className="hover:shadow-ambient transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Avatar name={review.author} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-on-surface text-sm">{review.author}</p>
                      <p className="text-xs text-on-surface/40">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-on-surface/20"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1 mb-2">
                    <span className="rounded-md bg-surface-container px-2 py-0.5 text-[10px] text-on-surface/70">
                      {t(`categories.${review.category}`)}
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{review.target}</span>
                  </div>
                  <p className="text-sm text-on-surface/80 leading-relaxed">{review.comment}</p>

                  {/* Reply display */}
                  {review.replied && review.replyText && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedReplies((prev) => ({ ...prev, [review.id]: !prev[review.id] }))}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary"
                      >
                        <MessageSquare className="h-3 w-3" />
                        {t("viewReply")}
                        {expandedReplies[review.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                      {expandedReplies[review.id] && (
                        <div className="mt-2 rounded-lg bg-primary/10 border border-primary/100 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary">{t("partnerReply")}</span>
                            <span className="text-[10px] text-on-surface/40">{review.replyDate}</span>
                          </div>
                          <p className="text-sm text-primary">{review.replyText}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      disabled={helpfulMap[review.id]}
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-1 text-xs transition-all ${helpfulMap[review.id] ? "text-primary font-medium" : "text-on-surface/40 hover:text-on-surface/70"}`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {t("helpful")} ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                    </button>
                    {!review.replied && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                      >
                        <MessageSquare className="h-3 w-3" />
                        {t("reply")}
                      </Button>
                    )}
                  </div>

                  {/* Reply form */}
                  {replyingTo === review.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border-0 bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/300 focus:border-primary/400"
                        placeholder={t("replyPlaceholder")}
                        value={replyInputs[review.id] ?? ""}
                        onChange={(e) => setReplyInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="text-xs h-7" onClick={() => handleReply(review.id)} disabled={!replyInputs[review.id]?.trim()}>
                          <Send className="h-3 w-3 mr-1" />
                          {t("sendReply")}
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setReplyingTo(null)}>
                          {t("cancel")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
