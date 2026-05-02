"use client";

import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Review } from "@/types";
import { formatDateShort } from "@/lib/utils";
import { Star } from "lucide-react";

const columns: ColumnDef<Review>[] = [
  {
    id: "reviewerName",
    header: "Reviewer",
    accessorKey: "reviewerName",
    sortable: true,
  },
  {
    id: "rating",
    header: "Rating",
    accessorFn: (row) => `${row.rating}/5`,
    sortable: true,
  },
  {
    id: "createdAt",
    header: "Date",
    accessorFn: (row) => formatDateShort(row.createdAt),
    sortable: true,
  },
  {
    id: "comment",
    header: "Comment",
    accessorKey: "comment",
  },
];

export function PropertyReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <DataTable
      data={reviews}
      columns={columns}
      keyExtractor={(row) => row.id}
      searchableFields={["reviewerName", "comment"]}
      searchPlaceholder="Search reviews..."
      pageSize={10}
      emptyState={{
        title: "Belum ada ulasan untuk properti ini.",
      }}
      mobileCardRenderer={(review) => (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">{review.reviewerName}</CardTitle>
            <p className="text-xs text-on-surface/60">{formatDateShort(review.createdAt)}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-on-surface/20"}`}
                />
              ))}
            </div>
            <p className="text-sm text-on-surface/80">{review.comment}</p>
          </CardContent>
        </Card>
      )}
    />
  );
}
