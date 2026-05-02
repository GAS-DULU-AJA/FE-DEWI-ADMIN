"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ExperienceReviewCard } from "@/features/experience/components/review-card";
import { getExperienceReviews, getExperiences } from "@/features/experience/utils";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import type { ExperienceReview } from "@/features/experience/types";

type ReviewRow = ExperienceReview & { experienceName: string };

export default function ExperienceReviewsPage() {
  const t = useTranslations("experience");
  const tc = useTranslations("common");
  const reviews = getExperienceReviews();
  const experiences = getExperiences();
  const [selectedId, setSelectedId] = useState<string | null>(reviews[0]?.id ?? null);

  const rows = useMemo<ReviewRow[]>(
    () =>
      reviews.map((review) => ({
        ...review,
        experienceName:
          experiences.find((experience) => experience.id === review.experienceId)?.name ?? "-",
      })),
    [reviews, experiences],
  );

  const average = rows.length === 0 ? 0 : rows.reduce((sum, review) => sum + review.rating, 0) / rows.length;
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null;

  const columns = useMemo<ColumnDef<ReviewRow>[]>(
    () => [
      {
        id: "reviewer",
        header: tc("name"),
        accessorKey: "reviewerName",
        sortable: true,
      },
      {
        id: "experience",
        header: t("components.experience"),
        accessorKey: "experienceName",
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "rating",
        header: t("analytics.avgRating"),
        accessorFn: (row) => row.rating.toFixed(1),
        sortable: true,
      },
      {
        id: "date",
        header: tc("date"),
        accessorKey: "createdAt",
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [t, tc],
  );

  const actions = (row: ReviewRow): ActionItem[] => [
    {
      label: tc("view"),
      onClick: () => setSelectedId(row.id),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("reviews.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("reviews.averageRating", { value: average.toFixed(1) })}</p>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["reviewerName", "experienceName", "comment"]}
        searchPlaceholder={`${tc("search")}...`}
        pageSize={10}
        onRowClick={(row) => setSelectedId(row.id)}
        actions={actions}
        mobileCardRenderer={(row) => (
          <div className="space-y-1">
            <p className="font-medium text-on-surface">{row.reviewerName}</p>
            <p className="text-xs text-on-surface/60">{row.experienceName}</p>
            <p className="text-xs text-on-surface/60">{row.rating.toFixed(1)} / 5</p>
          </div>
        )}
      />

      {selected ? <ExperienceReviewCard review={selected} experienceName={selected.experienceName} /> : null}
    </div>
  );
}
