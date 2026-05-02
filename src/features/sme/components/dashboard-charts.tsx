import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

function PlaceholderChart({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4 text-xs text-on-surface/60">
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
}

export function SmeDashboardCharts() {
  const t = useTranslations("sme.dashboard.charts");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PlaceholderChart title={t("revenueTrend.title")} subtitle={t("revenueTrend.subtitle")} />
      <PlaceholderChart title={t("topSellingProducts.title")} subtitle={t("topSellingProducts.subtitle")} />
      <PlaceholderChart title={t("orderStatus.title")} subtitle={t("orderStatus.subtitle")} />
      <PlaceholderChart title={t("categoryBreakdown.title")} subtitle={t("categoryBreakdown.subtitle")} />
    </div>
  );
}
