import { ExperienceReviewCard, getExperienceReviews } from "@/features/experience";
import { getTranslations } from "next-intl/server";

export default async function ExperienceReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const reviews = getExperienceReviews();
  const average = reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("reviews.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("reviews.averageRating", { value: average.toFixed(1) })}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {reviews.map((review) => (
          <ExperienceReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
