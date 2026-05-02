import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmePromotion } from "@/features/sme/types";
import { useLocale, useTranslations } from "next-intl";

export function SmePromotionCard({ promotion, productNames }: { promotion: SmePromotion; productNames?: string[] }) {
  const t = useTranslations("sme.promotions");
  const locale = useLocale();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{promotion.name}</CardTitle>
        {productNames && productNames.length > 0 && (
          <p className="text-xs text-on-surface/60">
            {productNames.length <= 2 ? productNames.join(", ") : `${productNames.length} products`}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-on-surface/70">
        <p>{t(`types.${promotion.type}`)}</p>
        <p>
          {promotion.discountType === "percentage"
            ? `${promotion.discountValue}%`
            : promotion.discountValue.toLocaleString(locale)}
        </p>
        <p>{promotion.validFrom} - {promotion.validTo}</p>
      </CardContent>
    </Card>
  );
}
