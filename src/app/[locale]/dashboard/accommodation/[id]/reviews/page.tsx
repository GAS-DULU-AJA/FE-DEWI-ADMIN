import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCOMMODATIONS,
  AccommodationPageHeader,
  PropertyDetailTabs,
  getAccommodationById,
  getAccommodationReviewsByAccommodationId,
} from "@/features/accommodation";
import { formatDateShort } from "@/lib/utils";
import { Star } from "lucide-react";

export default async function PropertyReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  const reviews = getAccommodationReviewsByAccommodationId(id);
  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Property Reviews"
        description={accommodation.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: accommodation.name, href: `/dashboard/accommodation/${id}` },
          { label: "Reviews" },
        ]}
        backHref={`/dashboard/accommodation/${id}`}
      />

      <PropertyDetailTabs propertyId={id} activeKey="reviews" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{reviews.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">
            {averageRating.toFixed(1)}
          </CardContent>
        </Card>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-stone-500">
            Belum ada ulasan untuk properti ini.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const target = ACCOMMODATIONS.find((item) => item.id === review.targetId);
            return (
              <Card key={review.id}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">{review.reviewerName}</CardTitle>
                  <p className="text-xs text-stone-500">
                    {target?.name ?? accommodation.name} · {formatDateShort(review.createdAt)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-stone-700">{review.comment}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
