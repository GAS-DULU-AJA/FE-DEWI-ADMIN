"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExperiencePromotionCard } from "@/features/experience/components/promotion-card";
import { ExperiencePromotionForm } from "@/features/experience/components/promotion-form";
import { getExperiencePromotions, getExperiences } from "@/features/experience/utils";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

export default function ExperiencePromotionsPage() {
  const t = useTranslations("experience");
  const promotions = getExperiencePromotions();
  const experiences = getExperiences();
  const [showForm, setShowForm] = useState(false);

  const getExperienceName = (id: string) =>
    experiences.find((e) => e.id === id)?.name;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("promotions.title")}</h1>
          <p className="mt-1 text-sm text-stone-500">{t("promotions.subtitle")}</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          {t("components.create")}
        </Button>
      </div>

      <ExperiencePromotionForm open={showForm} onOpenChange={setShowForm} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => (
          <ExperiencePromotionCard key={promotion.id} promotion={promotion} experienceName={getExperienceName(promotion.experienceId)} />
        ))}
      </div>
    </div>
  );
}
