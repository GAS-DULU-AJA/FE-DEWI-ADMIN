import { Badge } from "@/components/ui/badge";
import { SME_ORDER_STATUS_META } from "@/features/sme";
import type { SmeOrderStatus } from "@/features/sme";
import { useTranslations } from "next-intl";

export function SmeOrderStatusBadge({ status }: { status: SmeOrderStatus }) {
  const meta = SME_ORDER_STATUS_META[status];
  const t = useTranslations("sme.orderStatus");
  return <Badge className={meta.className}>{t(status)}</Badge>;
}
