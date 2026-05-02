import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmeOrderStatusBadge } from "./order-status-badge";
import type { SmeOrder } from "@/features/sme/types";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function SmeOrderCard({
  order,
  selected = false,
  onSelect,
}: {
  order: SmeOrder;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const t = useTranslations("sme.orders");

  return (
    <Card
      className={selected ? "ring-2 ring-amber-400" : ""}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{order.customerName}</CardTitle>
            <p className="text-xs text-on-surface/60">{t("orderNumber", { id: order.id })}</p>
          </div>
          <SmeOrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-on-surface/70">
        <p>{t("itemsCount", { count: order.items.length })}</p>
        <p className="font-medium text-on-surface">{formatCurrency(order.totalPrice)}</p>
        <p>{t("pickupEta", { value: order.estimatedPickupTime ?? "-" })}</p>
      </CardContent>
    </Card>
  );
}
