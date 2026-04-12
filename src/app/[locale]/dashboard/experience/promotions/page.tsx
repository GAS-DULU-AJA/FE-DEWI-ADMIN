import { ExperiencePromotionCard } from "@/features/experience/components/promotion-card";
import { ExperiencePromotionForm } from "@/features/experience/components/promotion-form";
import { getExperiencePromotions } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperiencePromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const promotions = getExperiencePromotions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("promotions.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("promotions.subtitle")}</p>
      </div>

      <ExperiencePromotionForm />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => (
          <ExperiencePromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </div>
  );
}
