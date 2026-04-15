"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SmeReview } from "@/features/sme/types";
import { useTranslations } from "next-intl";
import { MessageSquare, Send } from "lucide-react";

export function SmeReviewCard({ review }: { review: SmeReview }) {
  const t = useTranslations("sme.reviews");
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [savedResponse, setSavedResponse] = useState(review.response ?? null);

  const handleSubmit = () => {
    const text = replyText.trim();
    if (!text) return;
    setSavedResponse(text);
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{review.reviewerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-600">
        <p>{t("ratingValue", { rating: review.rating })}</p>
        <p>{review.comment}</p>
        {savedResponse ? (
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
            <span className="text-xs font-semibold text-emerald-700">{t("partnerReply")}</span>
            <p className="text-sm text-emerald-800 mt-1">{savedResponse}</p>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageSquare className="h-3 w-3" />
            {t("reply")}
          </Button>
        )}
        {isReplying && (
          <div className="space-y-2">
            <textarea
              rows={3}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
              placeholder={t("replyPlaceholder")}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" className="text-xs h-7" onClick={handleSubmit} disabled={!replyText.trim()}>
                <Send className="h-3 w-3 mr-1" />
                {t("sendReply")}
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setIsReplying(false)}>
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
