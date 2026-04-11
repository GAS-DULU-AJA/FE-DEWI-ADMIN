import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmePromotionCard, SmePromotionForm, getSmePromotions } from "@/features/sme";
import { useTranslations } from "next-intl";

export default function SmePromotionsPage() {
  const t = useTranslations("sme.promotions");
  const promotions = getSmePromotions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.totalPromotions")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{promotions.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.active")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-700">
            {promotions.filter((promotion) => promotion.status === "active").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.withPromoCode")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">
            {promotions.filter((promotion) => promotion.promoCode).length}
          </CardContent>
        </Card>
      </div>

      <SmePromotionForm />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => (
          <SmePromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </div>
  );
}
