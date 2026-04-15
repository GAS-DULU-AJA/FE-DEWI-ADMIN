"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VILLAGE_REVIEWS } from "@/features/village/mock-data";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { MessageSquare, Send, ChevronDown, ChevronUp, Star } from "lucide-react";

type ReplyState = Record<string, { text: string; date: string }>;

export default function VillageReviewsPage() {
  const t = useTranslations("village");
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replies, setReplies] = useState<ReplyState>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const list = useMemo(() => {
    if (filter === "all") return VILLAGE_REVIEWS;
    return VILLAGE_REVIEWS.filter((item) => item.entityType === filter);
  }, [filter]);

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

  const filterOptions = ["all", "experience", "facility", "general"];

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("reviews.title")}
        description={t("reviews.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.reviews") },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1 text-xs transition-all ${filter === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
          >
            {t(`reviews.filters.${item}`)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((review) => {
          const reply = replies[review.id];
          const hasExistingResponse = review.hasResponse;

          return (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{review.targetName}</CardTitle>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-500">{review.reviewerName} • {review.createdAt}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-stone-700">{review.comment}</p>

                {/* Existing response or saved reply */}
                {(hasExistingResponse || reply) && (
                  <div>
                    <button
                      onClick={() => setExpandedReplies((prev) => ({ ...prev, [review.id]: !prev[review.id] }))}
                      className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {t("reviews.viewReply")}
                      {expandedReplies[review.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    {expandedReplies[review.id] && (
                      <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-emerald-700">{t("reviews.adminReply")}</span>
                          {reply && <span className="text-[10px] text-stone-400">{reply.date}</span>}
                        </div>
                        <p className="text-sm text-emerald-800">
                          {reply?.text ?? t("reviews.previouslyResponded")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reply actions */}
                {!hasExistingResponse && !reply && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                    >
                      <MessageSquare className="h-3 w-3" />
                      {t("reviews.replyButton")}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 text-amber-600 border-amber-200 hover:bg-amber-50">
                      {t("actions.flagReview")}
                    </Button>
                  </div>
                )}

                {/* Reply textarea */}
                {replyingTo === review.id && (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                      placeholder={t("reviews.responsePlaceholder")}
                      value={replyInputs[review.id] ?? ""}
                      onChange={(e) => setReplyInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="text-xs h-7" onClick={() => handleReply(review.id)} disabled={!replyInputs[review.id]?.trim()}>
                        <Send className="h-3 w-3 mr-1" />
                        {t("actions.submitResponse")}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setReplyingTo(null)}>
                        {t("actions.cancel")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
