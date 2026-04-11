import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExperienceReview } from "@/features/experience";
import { useTranslations } from "next-intl";

export function ExperienceReviewCard({ review }: { review: ExperienceReview }) {
  const t = useTranslations("experience");
  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{review.reviewerName}</CardTitle>
          <Badge variant={review.rating >= 4.5 ? "default" : "secondary"}>{review.rating.toFixed(1)} {t("components.outOfFive")}</Badge>
        </div>
        <p className="text-sm text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-700">
        <p>{review.comment}</p>
        {review.organizerResponse ? (
          <p className="rounded-lg bg-emerald-50 p-2 text-emerald-700">{t("components.organizer")}: {review.organizerResponse}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
