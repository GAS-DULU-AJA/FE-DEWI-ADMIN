import { PostEventSurveyCard, PostEventSurveyForm } from "@/features/experience/components/post-event-survey";
import { ExperienceReviewCard } from "@/features/experience/components/review-card";
import { getExperienceReviews, getPostEventSurveys } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function PostEventPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const surveys = getPostEventSurveys();
  const reviews = getExperienceReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("postEvent.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("postEvent.subtitle")}</p>
      </div>

      <PostEventSurveyForm />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">{t("postEvent.existingSurveys")}</h2>
        {surveys.map((survey) => (
          <PostEventSurveyCard key={survey.id} survey={survey} />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">{t("postEvent.recentReviews")}</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reviews.map((review) => (
            <ExperienceReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
