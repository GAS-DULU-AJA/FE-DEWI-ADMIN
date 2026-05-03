"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { VILLAGE_REVIEWS } from "@/features/village/mock-data";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { MessageSquare, Send, ChevronDown, ChevronUp, Star } from "lucide-react";

type ReplyState = Record<string, { text: string; date: string }>;

export default function VillageReviewsPage() {
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replies, setReplies] = useState<ReplyState>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(VILLAGE_REVIEWS[0]?.id ?? null);

  const list = useMemo(() => {
    if (filter === "all") return VILLAGE_REVIEWS;
    return VILLAGE_REVIEWS.filter((item) => item.entityType === filter);
  }, [filter]);

  const selectedReview = list.find((item) => item.id === selectedId) ?? list[0] ?? null;

  const columns = useMemo<ColumnDef<(typeof list)[number]>[]>(
    () => [
      {
        id: "target",
        header: tc("name"),
        accessorKey: "targetName",
        sortable: true,
      },
      {
        id: "reviewer",
        header: t("partners.ownerName"),
        accessorKey: "reviewerName",
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "type",
        header: tc("status"),
        accessorFn: (row) => t(`reviews.filters.${row.entityType}`),
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: t("reviews.filters.experience"), value: "experience" },
          { label: t("reviews.filters.facility"), value: "facility" },
          { label: t("reviews.filters.general"), value: "general" },
        ],
        hideOnMobile: true,
      },
      {
        id: "rating",
        header: t("experiences.rating"),
        accessorFn: (row) => `${row.rating}/5`,
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
    [t, tc, list],
  );

  const getActions = (row: (typeof list)[number]): ActionItem[] => [
    {
      label: t("partners.viewDetail"),
      onClick: () => setSelectedId(row.id),
    },
  ];

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

  const filterOptions = ["all", "experience", "facility", "general"];

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
        {filterOptions.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1 text-xs transition-all ${filter === item ? "bg-primary text-white" : "bg-surface-container text-on-surface/70 hover:bg-surface-container-high"}`}
          >
            {t(`reviews.filters.${item}`)}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("reviews.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={list}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["targetName", "reviewerName", "comment"]}
            searchPlaceholder={`${tc("search")}...`}
            pageSize={10}
            onRowClick={(row) => setSelectedId(row.id)}
            actions={getActions}
            mobileCardRenderer={(row) => (
              <div className="space-y-1">
                <p className="font-medium text-on-surface">{row.targetName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface/60">{row.reviewerName}</span>
                  <Badge variant="outline">{row.rating}/5</Badge>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {selectedReview ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{selectedReview.targetName}</CardTitle>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i <= selectedReview.rating ? "fill-amber-400 text-amber-400" : "text-on-surface/20"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-on-surface/60">{selectedReview.reviewerName} • {selectedReview.createdAt}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-on-surface/80">{selectedReview.comment}</p>

            {(selectedReview.hasResponse || replies[selectedReview.id]) && (
              <div>
                <button
                  onClick={() => setExpandedReplies((prev) => ({ ...prev, [selectedReview.id]: !prev[selectedReview.id] }))}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary"
                >
                  <MessageSquare className="h-3 w-3" />
                  {t("reviews.viewReply")}
                  {expandedReplies[selectedReview.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {expandedReplies[selectedReview.id] && (
                  <div className="mt-2 rounded-lg border border-primary/100 bg-primary/10 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">{t("reviews.adminReply")}</span>
                      {replies[selectedReview.id] ? (
                        <span className="text-[10px] text-on-surface/40">{replies[selectedReview.id].date}</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-primary">{replies[selectedReview.id]?.text ?? t("reviews.previouslyResponded")}</p>
                  </div>
                )}
              </div>
            )}

            {!selectedReview.hasResponse && !replies[selectedReview.id] ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setReplyingTo(replyingTo === selectedReview.id ? null : selectedReview.id)}
                >
                  <MessageSquare className="h-3 w-3" />
                  {t("reviews.replyButton")}
                </Button>
                <Button size="sm" variant="outline" className="h-7 border-amber-200 text-xs text-amber-600 hover:bg-amber-50">
                  {t("actions.flagReview")}
                </Button>
              </div>
            ) : null}

            {replyingTo === selectedReview.id ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-0 bg-surface-container-lowest px-3 py-2 text-sm focus:border-primary/400 focus:outline-none focus:ring-2 focus:ring-primary/300"
                  placeholder={t("reviews.responsePlaceholder")}
                  value={replyInputs[selectedReview.id] ?? ""}
                  onChange={(event) =>
                    setReplyInputs((prev) => ({ ...prev, [selectedReview.id]: event.target.value }))
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleReply(selectedReview.id)}
                    disabled={!replyInputs[selectedReview.id]?.trim()}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    {t("actions.submitResponse")}
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setReplyingTo(null)}>
                    {t("actions.cancel")}
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
