import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { PropertyReviewsTable } from "@/features/accommodation/components/property-reviews-table";
import { PropertyDetailTabs } from "@/features/accommodation/components/property-detail-tabs";
import { getAccommodationById, getAccommodationReviewsByAccommodationId } from "@/features/accommodation/utils";

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
          <CardContent className="text-2xl font-semibold text-on-surface">{reviews.length}</CardContent>
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

      <PropertyReviewsTable reviews={reviews} />
    </div>
  );
}
