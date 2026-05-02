"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import {
  getAllAccommodationReviews,
} from "@/features/accommodation/utils";
import { Star, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

type ReplyState = Record<string, { text: string; date: string }>;
type ReviewRow = ReturnType<typeof getAllAccommodationReviews>[number] & { accommodationName: string };

export default function PenginapanUlasanPage() {
  const t = useTranslations("accommodationReviews");
  const searchParams = useSearchParams();
  const presetAccommodationId = searchParams.get("accommodationId") ?? "all";

  const [selectedAccommodationId, setSelectedAccommodationId] = useState(presetAccommodationId);
  const [selectedRating, setSelectedRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [query, setQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replies, setReplies] = useState<ReplyState>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const reviews = getAllAccommodationReviews();

  const filteredReviews = useMemo<ReviewRow[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesAccommodation =
        selectedAccommodationId === "all" || review.targetId === selectedAccommodationId;
      const matchesRating = selectedRating === 0 || review.rating === selectedRating;
      const accommodation = ACCOMMODATIONS.find((item) => item.id === review.targetId);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [review.reviewerName, review.comment, accommodation?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesAccommodation && matchesRating && matchesQuery;
    }).map((review) => ({
      ...review,
      accommodationName: ACCOMMODATIONS.find((item) => item.id === review.targetId)?.name ?? "-",
    }));
  }, [reviews, selectedAccommodationId, selectedRating, query]);

  const selected = filteredReviews.find((review) => review.id === selectedId) ?? filteredReviews[0] ?? null;

  const summary = useMemo(() => {
    const avgRating =
      filteredReviews.length === 0
        ? 0
        : filteredReviews.reduce((sum, review) => sum + review.rating, 0) /
          filteredReviews.length;

    return {
      total: filteredReviews.length,
      avgRating: avgRating.toFixed(1),
    };
  }, [filteredReviews]);

  const handleReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) return;
    setReplies((prev) => ({
      ...prev,
      [reviewId]: { text, date: new Date().toISOString().slice(0, 10) },
    }));
    setReplyingTo(null);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
    setExpandedReplies((prev) => ({ ...prev, [reviewId]: true }));
  };

  const columns = useMemo<ColumnDef<ReviewRow>[]>(
    () => [
      {
        id: "reviewer",
        header: t("searchLabel"),
        accessorKey: "reviewerName",
        sortable: true,
      },
      {
        id: "accommodation",
        header: t("accommodation"),
        accessorKey: "accommodationName",
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "rating",
        header: t("rating"),
        accessorFn: (row) => row.rating.toFixed(1),
        sortable: true,
      },
      {
        id: "date",
        header: t("breadcrumbReviews"),
        accessorFn: (row) => formatDateShort(row.createdAt),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [t],
  );

  const actions = (row: ReviewRow): ActionItem[] => [
    {
      label: t("viewReply"),
      onClick: () => setSelectedId(row.id),
    },
  ];

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title={t("title")}
        description={t("description")}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: t("accommodation"), href: "/dashboard/accommodation" },
          { label: t("breadcrumbReviews") },
        ]}
        backHref="/dashboard/accommodation"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("filterTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">{t("accommodation")}</label>
            <select
              value={selectedAccommodationId}
              onChange={(event) => setSelectedAccommodationId(event.target.value)}
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            >
              <option value="all">{t("allAccommodations")}</option>
              {ACCOMMODATIONS.map((accommodation) => (
                <option key={accommodation.id} value={accommodation.id}>
                  {accommodation.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">{t("rating")}</label>
            <select
              value={selectedRating}
              onChange={(event) => setSelectedRating(Number(event.target.value) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            >
              <option value={0}>{t("allRatings")}</option>
              <option value={5}>{t("stars", { count: 5 })}</option>
              <option value={4}>{t("stars", { count: 4 })}</option>
              <option value={3}>{t("stars", { count: 3 })}</option>
              <option value={2}>{t("stars", { count: 2 })}</option>
              <option value={1}>{t("stars", { count: 1 })}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-on-surface/70">{t("searchLabel")}</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-10 w-full rounded-lg border-0 bg-surface-container-lowest px-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("totalReviews")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("averageRating")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">{summary.avgRating}</CardContent>
        </Card>
      </div>

      <DataTable
        data={filteredReviews}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["reviewerName", "accommodationName", "comment"]}
        searchPlaceholder={t("searchPlaceholder")}
        pageSize={10}
        onRowClick={(row) => setSelectedId(row.id)}
        actions={actions}
        mobileCardRenderer={(row) => (
          <div className="space-y-1">
            <p className="font-medium text-on-surface">{row.reviewerName}</p>
            <p className="text-xs text-on-surface/60">{row.accommodationName}</p>
            <p className="text-xs text-on-surface/60">{row.rating.toFixed(1)} / 5</p>
          </div>
        )}
      />

      {selected ? (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">{selected.reviewerName}</CardTitle>
            <p className="text-xs text-on-surface/60">
              {selected.accommodationName} · {formatDateShort(selected.createdAt)}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= selected.rating ? "fill-amber-400 text-amber-400" : "text-on-surface/20"}`}
                />
              ))}
            </div>
            <p className="text-sm text-on-surface/80">{selected.comment}</p>

            {replies[selected.id] ? (
              <div>
                <button
                  onClick={() =>
                    setExpandedReplies((prev) => ({
                      ...prev,
                      [selected.id]: !prev[selected.id],
                    }))
                  }
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary"
                >
                  <MessageSquare className="h-3 w-3" />
                  {t("viewReply")}
                  {expandedReplies[selected.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {expandedReplies[selected.id] ? (
                  <div className="mt-2 rounded-lg border border-primary/100 bg-primary/10 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">{t("partnerReply")}</span>
                      <span className="text-[10px] text-on-surface/40">{replies[selected.id].date}</span>
                    </div>
                    <p className="text-sm text-primary">{replies[selected.id].text}</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setReplyingTo(replyingTo === selected.id ? null : selected.id)}
                >
                  <MessageSquare className="h-3 w-3" />
                  {t("reply")}
                </Button>
              </div>
            )}

            {replyingTo === selected.id ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-0 bg-surface-container-lowest px-3 py-2 text-sm focus:border-primary/400 focus:outline-none focus:ring-2 focus:ring-primary/300"
                  placeholder={t("replyPlaceholder")}
                  value={replyInputs[selected.id] ?? ""}
                  onChange={(event) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [selected.id]: event.target.value,
                    }))
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleReply(selected.id)}
                    disabled={!replyInputs[selected.id]?.trim()}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    {t("sendReply")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setReplyingTo(null)}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-on-surface/60">
            {t("noReviews")}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
