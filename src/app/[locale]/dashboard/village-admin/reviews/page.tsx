"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VILLAGE_REVIEWS, VillagePageHeader } from "@/features/village";

export default function VillageReviewsPage() {
  const t = useTranslations("village");
  const [filter, setFilter] = useState("all");

  const list = useMemo(() => {
    if (filter === "all") return VILLAGE_REVIEWS;
    return VILLAGE_REVIEWS.filter((item) => item.entityType === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("reviews.title")}
        description={t("reviews.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.reviews") },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {["all", "experience", "facility", "general"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1 text-xs ${filter === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{review.targetName}</CardTitle>
              <p className="text-xs text-stone-500">{review.reviewerName} • {review.createdAt} • {review.rating}/5</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-stone-700">{review.comment}</p>
              <Textarea rows={3} placeholder={t("reviews.responsePlaceholder")} />
              <div className="flex gap-2">
                <Button size="sm">{t("actions.submitResponse")}</Button>
                <Button size="sm" variant="outline">{t("actions.flagReview")}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
