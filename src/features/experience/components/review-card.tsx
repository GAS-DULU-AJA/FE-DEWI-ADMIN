"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import type { ExperienceReview } from "@/features/experience/types";
import { useTranslations } from "next-intl";
import { MessageSquare, Send } from "lucide-react";

export function ExperienceReviewCard({ review, experienceName }: { review: ExperienceReview; experienceName?: string }) {
  const t = useTranslations("experience");
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [savedResponse, setSavedResponse] = useState(review.organizerResponse ?? null);

  const handleSubmit = () => {
    const text = replyText.trim();
    if (!text) return;
    setSavedResponse(text);
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        {experienceName && (
          <p className="text-xs font-medium text-primary">{experienceName}</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{review.reviewerName}</CardTitle>
          <Badge variant={review.rating >= 4.5 ? "default" : "secondary"}>{review.rating.toFixed(1)} {t("components.outOfFive")}</Badge>
        </div>
        <p className="text-sm text-on-surface/60">{new Date(review.createdAt).toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-on-surface/80">
        <p>{review.comment}</p>
        {savedResponse ? (
          <div className="rounded-lg bg-primary/10 border border-primary/100 p-3">
            <span className="text-xs font-semibold text-primary">{t("components.organizer")}</span>
            <p className="text-sm text-primary mt-1">{savedResponse}</p>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setIsReplying(true)}
          >
            <MessageSquare className="h-3 w-3" />
            {t("reviews.reply")}
          </Button>
        )}
        <FormModal
          open={isReplying}
          onOpenChange={setIsReplying}
          title={t("reviews.reply")}
          description={`${review.reviewerName} — "${review.comment.slice(0, 80)}${review.comment.length > 80 ? "…" : ""}"`}
          size="sm"
          onSubmit={handleSubmit}
          submitLabel={t("reviews.sendReply")}
          submitDisabled={!replyText.trim()}
        >
          <textarea
            rows={3}
            className="w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-primary/400"
            placeholder={t("reviews.replyPlaceholder")}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </FormModal>
      </CardContent>
    </Card>
  );
}
