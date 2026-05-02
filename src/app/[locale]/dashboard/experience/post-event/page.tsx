import { PostEventSurveyForm } from "@/features/experience/components/post-event-survey";
import { PostEventLists } from "@/features/experience/components/post-event-lists";
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
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("postEvent.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("postEvent.subtitle")}</p>
      </div>

      <PostEventSurveyForm />

      <PostEventLists surveys={surveys} reviews={reviews} />
    </div>
  );
}
