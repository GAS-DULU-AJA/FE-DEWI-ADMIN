import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmeOrder } from "@/features/sme";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function SmeOrderDetail({ order }: { order: SmeOrder }) {
  const t = useTranslations("sme.orders");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("orderDetail")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-stone-900">{order.customerName}</p>
          <p className="text-stone-500">{order.customerPhone} · {order.customerEmail}</p>
        </div>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between rounded-lg border border-stone-200 p-2">
              <span>{t("itemRow", { name: item.productName, qty: item.quantity })}</span>
              <span className="font-medium text-stone-900">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
