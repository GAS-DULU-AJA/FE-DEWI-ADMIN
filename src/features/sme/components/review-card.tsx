import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmeReview } from "@/features/sme/types";
import { useTranslations } from "next-intl";

export function SmeReviewCard({ review }: { review: SmeReview }) {
  const t = useTranslations("sme.reviews");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{review.reviewerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-600">
        <p>{t("ratingValue", { rating: review.rating })}</p>
        <p>{review.comment}</p>
        {review.response ? <p className="text-emerald-700">{t("reply", { response: review.response })}</p> : null}
      </CardContent>
    </Card>
  );
}
