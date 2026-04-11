import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCOMMODATIONS,
  AccommodationPageHeader,
  PromotionCard,
  PromotionForm,
  getAllAccommodationPromotions,
} from "@/features/accommodation";

export default function AccommodationPromotionsPage() {
  const promotions = getAllAccommodationPromotions();
  const activePromotions = promotions.filter((promotion) => promotion.status === "active");

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Promotion Management"
        description="Manage seasonal campaigns, promo codes, and bundle offers for accommodation partners."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: "Promotions" },
        ]}
        backHref="/dashboard/accommodation"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Promotions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{promotions.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Promotions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-700">
            {activePromotions.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Covered Properties</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{ACCOMMODATIONS.length}</CardContent>
        </Card>
      </div>

      <PromotionForm />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </div>
  );
}