"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { SmeReviewCard } from "@/features/sme/components/review-card";
import { getSmeReviews, getSmeProducts } from "@/features/sme/utils";
import { useTranslations } from "next-intl";
import type { SmeReview } from "@/features/sme/types";

type ReviewRow = SmeReview & { productName: string };

export default function SmeReviewsPage() {
  const t = useTranslations("sme.reviews");
  const tc = useTranslations("common");
  const reviews = getSmeReviews();
  const products = getSmeProducts();
  const [selectedId, setSelectedId] = useState<string | null>(reviews[0]?.id ?? null);

  const rows = useMemo<ReviewRow[]>(
    () =>
      reviews.map((review) => ({
        ...review,
        productName: products.find((product) => product.id === review.targetId)?.name ?? "-",
      })),
    [reviews, products],
  );

  const avg =
    rows.length === 0
      ? 0
      : rows.reduce((sum, review) => sum + review.rating, 0) / rows.length;

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
        id: "product",
        header: t("product"),
        accessorKey: "productName",
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "rating",
        header: t("averageRating"),
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
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-on-surface/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("totalReviews")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{reviews.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("averageRating")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">{avg.toFixed(1)}</CardContent>
        </Card>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["reviewerName", "productName", "comment"]}
        searchPlaceholder={`${tc("search")}...`}
        pageSize={10}
        onRowClick={(row) => setSelectedId(row.id)}
        actions={actions}
        mobileCardRenderer={(row) => (
          <div className="space-y-1">
            <p className="font-medium text-on-surface">{row.reviewerName}</p>
            <p className="text-xs text-on-surface/60">{row.productName}</p>
            <p className="text-xs text-on-surface/60">{row.rating.toFixed(1)} / 5</p>
          </div>
        )}
      />

      {selected ? <SmeReviewCard review={selected} productName={selected.productName} /> : null}
    </div>
  );
}
