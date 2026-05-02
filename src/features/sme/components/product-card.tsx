import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmeProduct } from "@/features/sme/types";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function SmeProductCard({ product }: { product: SmeProduct }) {
  const t = useTranslations("sme.products");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-on-surface/70">
        <p>{product.category}</p>
        <p className="font-medium text-on-surface">{formatCurrency(product.price)}</p>
        <p>{t("stockValue", { value: product.stock })}</p>
      </CardContent>
    </Card>
  );
}
