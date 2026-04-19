import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmeReviewCard } from "@/features/sme/components/review-card";
import { getSmeReviews, getSmeProducts } from "@/features/sme/utils";
import { useTranslations } from "next-intl";

export default function SmeReviewsPage() {
  const t = useTranslations("sme.reviews");
  const reviews = getSmeReviews();
  const products = getSmeProducts();
  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const getProductName = (targetId: string) =>
    products.find((p) => p.id === targetId)?.name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("totalReviews")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{reviews.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("averageRating")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">{avg.toFixed(1)}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {reviews.map((review) => (
          <SmeReviewCard
            key={review.id}
            review={review}
            productName={getProductName(review.targetId)}
          />
        ))}
      </div>
    </div>
  );
}
