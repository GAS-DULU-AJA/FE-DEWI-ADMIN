"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import {
  getAllAccommodationReviews,
} from "@/features/accommodation/utils";
import { Star, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

type ReplyState = Record<string, { text: string; date: string }>;

export default function PenginapanUlasanPage() {
  const t = useTranslations("accommodationReviews");
  const searchParams = useSearchParams();
  const presetAccommodationId = searchParams.get("accommodationId") ?? "all";

  const [selectedAccommodationId, setSelectedAccommodationId] = useState(presetAccommodationId);
  const [selectedRating, setSelectedRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [query, setQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replies, setReplies] = useState<ReplyState>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

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

  const handleReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) return;
    setReplies((prev) => ({
      ...prev,
      [reviewId]: { text, date: new Date().toISOString().slice(0, 10) },
    }));
    setReplyingTo(null);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
    setExpandedReplies((prev) => ({ ...prev, [reviewId]: true }));
  };

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title={t("title")}
        description={t("description")}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: t("accommodation"), href: "/dashboard/accommodation" },
          { label: t("breadcrumbReviews") },
        ]}
        backHref="/dashboard/accommodation"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("filterTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">{t("accommodation")}</label>
            <select
              value={selectedAccommodationId}
              onChange={(event) => setSelectedAccommodationId(event.target.value)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            >
              <option value="all">{t("allAccommodations")}</option>
              {ACCOMMODATIONS.map((accommodation) => (
                <option key={accommodation.id} value={accommodation.id}>
                  {accommodation.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">{t("rating")}</label>
            <select
              value={selectedRating}
              onChange={(event) => setSelectedRating(Number(event.target.value) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            >
              <option value={0}>{t("allRatings")}</option>
              <option value={5}>{t("stars", { count: 5 })}</option>
              <option value={4}>{t("stars", { count: 4 })}</option>
              <option value={3}>{t("stars", { count: 3 })}</option>
              <option value={2}>{t("stars", { count: 2 })}</option>
              <option value={1}>{t("stars", { count: 1 })}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">{t("searchLabel")}</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("totalReviews")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("averageRating")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">{summary.avgRating}</CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const accommodation = ACCOMMODATIONS.find((item) => item.id === review.targetId);
          const reply = replies[review.id];

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

                {/* Reply display */}
                {reply && (
                  <div>
                    <button
                      onClick={() => setExpandedReplies((prev) => ({ ...prev, [review.id]: !prev[review.id] }))}
                      className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {t("viewReply")}
                      {expandedReplies[review.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    {expandedReplies[review.id] && (
                      <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-emerald-700">{t("partnerReply")}</span>
                          <span className="text-[10px] text-stone-400">{reply.date}</span>
                        </div>
                        <p className="text-sm text-emerald-800">{reply.text}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {!reply && (
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
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-stone-500">
            {t("noReviews")}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
