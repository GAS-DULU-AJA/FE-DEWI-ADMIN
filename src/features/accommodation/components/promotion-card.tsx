import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Promotion } from "@/types";

export function PromotionCard({ promotion }: { promotion: Promotion }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{promotion.name}</CardTitle>
          <Badge variant={promotion.status === "active" ? "default" : "secondary"}>{promotion.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-600">
        <p>{promotion.type}</p>
        <p>
          {promotion.discountType === "percentage"
            ? `${promotion.discountValue}% off`
            : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(promotion.discountValue)}
        </p>
        <p>{promotion.validFrom} - {promotion.validTo}</p>
        {promotion.promoCode ? <p>Code: {promotion.promoCode}</p> : null}
      </CardContent>
    </Card>
  );
}
