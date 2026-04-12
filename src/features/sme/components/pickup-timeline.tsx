import type { SmeOrderStatus } from "@/features/sme/types";
import { useTranslations } from "next-intl";

const FLOW: SmeOrderStatus[] = [
  "pending_payment",
  "paid",
  "preparing",
  "ready_for_pickup",
  "picked_up",
];

export function PickupTimeline({ status }: { status: SmeOrderStatus }) {
  const t = useTranslations("sme.orderStatus");
  const currentIndex = FLOW.indexOf(status);
  return (
    <div className="space-y-2">
      {FLOW.map((step, idx) => {
        const active = idx <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-emerald-600" : "bg-stone-300"}`} />
            <span className={active ? "text-sm text-stone-900" : "text-sm text-stone-500"}>{t(step)}</span>
          </div>
        );
      })}
    </div>
  );
}
