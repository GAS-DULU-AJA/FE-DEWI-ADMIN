"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { PromotionCard } from "@/features/accommodation/components/promotion-card";
import { PromotionForm } from "@/features/accommodation/components/promotion-form";
import {
  getAllAccommodationPromotions,
} from "@/features/accommodation/utils";
import { Plus } from "lucide-react";

export default function AccommodationPromotionsPage() {
  const promotions = getAllAccommodationPromotions();
  const activePromotions = promotions.filter((promotion) => promotion.status === "active");
  const [showForm, setShowForm] = useState(false);

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
        action={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Promotion
          </Button>
        }
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

      <PromotionForm open={showForm} onOpenChange={setShowForm} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => {
          const ids = promotion.applicableAccommodationIds;
          const names = ids === "all"
            ? ACCOMMODATIONS.map((a) => a.name)
            : ACCOMMODATIONS.filter((a) => ids.includes(a.id)).map((a) => a.name);
          return (
            <PromotionCard key={promotion.id} promotion={promotion} entityNames={names} />
          );
        })}
      </div>
    </div>
  );
}