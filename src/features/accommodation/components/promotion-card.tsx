import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Promotion } from "@/types";

export function PromotionCard({ promotion, entityNames }: { promotion: Promotion; entityNames?: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{promotion.name}</CardTitle>
          <Badge variant={promotion.status === "active" ? "default" : "secondary"}>{promotion.status}</Badge>
        </div>
        {entityNames && entityNames.length > 0 && (
          <p className="text-xs text-on-surface/60">
            {entityNames.length === 1 ? entityNames[0] : `${entityNames.length} properties`}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-on-surface/70">
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
