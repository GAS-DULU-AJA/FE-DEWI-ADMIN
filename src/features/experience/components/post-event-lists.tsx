"use client";

import { useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { PostEventSurveyCard } from "@/features/experience/components/post-event-survey";
import { ExperienceReviewCard } from "@/features/experience/components/review-card";
import type { ExperienceReview, PostEventSurvey } from "@/features/experience/types";
import { useTranslations } from "next-intl";

type SurveyRow = PostEventSurvey & {
  questionCount: number;
};

export function PostEventLists({
  surveys,
  reviews,
}: {
  surveys: PostEventSurvey[];
  reviews: ExperienceReview[];
}) {
  const t = useTranslations("experience");
  const tc = useTranslations("common");

  const surveyRows = useMemo<SurveyRow[]>(
    () =>
      surveys.map((survey) => ({
        ...survey,
        questionCount: survey.questions.length,
      })),
    [surveys],
  );

  const surveyColumns = useMemo<ColumnDef<SurveyRow>[]>(
    () => [
      {
        id: "title",
        header: t("postEvent.surveyTitle"),
        accessorKey: "title",
        sortable: true,
      },
      {
        id: "questionCount",
        header: t("postEvent.question"),
        accessorFn: (row) => String(row.questionCount),
        sortable: true,
      },
      {
        id: "responses",
        header: "Responses",
        accessorFn: (row) => String(row.totalResponses),
        sortable: true,
      },
      {
        id: "averageSatisfaction",
        header: "Satisfaction",
        accessorFn: (row) => row.averageSatisfaction.toFixed(1),
        sortable: true,
      },
      {
        id: "createdAt",
        header: tc("date"),
        accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [t, tc],
  );

  const reviewColumns = useMemo<ColumnDef<ExperienceReview>[]>(
    () => [
      {
        id: "reviewerName",
        header: tc("name"),
        accessorKey: "reviewerName",
        sortable: true,
      },
      {
        id: "rating",
        header: "Rating",
        accessorFn: (row) => row.rating.toFixed(1),
        sortable: true,
      },
      {
        id: "comment",
        header: tc("description"),
        accessorKey: "comment",
      },
      {
        id: "createdAt",
        header: tc("date"),
        accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [tc],
  );

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-on-surface">{t("postEvent.existingSurveys")}</h2>
        <DataTable
          data={surveyRows}
          columns={surveyColumns}
          keyExtractor={(row) => row.id}
          searchableFields={["title"]}
          searchPlaceholder={`${tc("search")}...`}
          pageSize={10}
          mobileCardRenderer={(row) => <PostEventSurveyCard survey={row} />}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-on-surface">{t("postEvent.recentReviews")}</h2>
        <DataTable
          data={reviews}
          columns={reviewColumns}
          keyExtractor={(row) => row.id}
          searchableFields={["reviewerName", "comment"]}
          searchPlaceholder={`${tc("search")}...`}
          pageSize={10}
          mobileCardRenderer={(row) => <ExperienceReviewCard review={row} />}
        />
      </div>
    </>
  );
}
