import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RevenueSplit } from "@/features/experience";
import { useTranslations } from "next-intl";

export function RevenueShareDisplay({ split }: { split: RevenueSplit }) {
  const t = useTranslations("experience");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.revenueSharing")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-stone-200 p-3 text-center">
          <p className="text-stone-500">{t("components.organizer")}</p>
          <p className="text-lg font-semibold text-stone-900">{split.organizer}%</p>
        </div>
        <div className="rounded-lg border border-stone-200 p-3 text-center">
          <p className="text-stone-500">{t("components.village")}</p>
          <p className="text-lg font-semibold text-stone-900">{split.village}%</p>
        </div>
        <div className="rounded-lg border border-stone-200 p-3 text-center">
          <p className="text-stone-500">{t("components.platform")}</p>
          <p className="text-lg font-semibold text-stone-900">{split.platform}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
