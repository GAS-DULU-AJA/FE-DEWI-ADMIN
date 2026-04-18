import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Plus, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { SME_ORDERS, SME_PRODUCTS, SME_PROFILE } from "@/features/sme/mock-data";
import { SmeDashboardCharts } from "@/features/sme/components/dashboard-charts";
import { SmeProfileForm } from "@/features/sme/components/sme-profile-form";
import { getSmeDashboardMetrics } from "@/features/sme/utils";

export default function UmkmDashboard() {
  const t = useTranslations("sme.dashboard");
  const metrics = getSmeDashboardMetrics();
  const lowStockItems = SME_PRODUCTS.filter((product) => product.stock <= 5);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
          <p className="text-sm text-stone-500 mt-0.5">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Tag className="h-4 w-4" />
            {t("actions.createPromotion")}
          </Button>
          <Button size="sm">
            <Package className="h-4 w-4" />
            {t("actions.viewOrders")}
          </Button>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label={t("kpi.totalProducts")} value={metrics.totalProducts} icon="products" color="amber" />
        <StatCard label={t("kpi.activeProducts")} value={metrics.activeProducts} icon="products" color="emerald" />
        <StatCard label={t("kpi.ordersToday")} value={metrics.ordersToday} icon="partners" color="blue" />
        <StatCard
          label={t("kpi.monthlyRevenue")}
          value={formatCurrency(metrics.monthlyRevenue)}
          icon="revenue"
          color="emerald"
        />
        <StatCard label={t("kpi.lowStockAlerts")} value={metrics.lowStockAlerts} icon="products" color="rose" />
        <StatCard
          label={t("kpi.avgRating")}
          value={metrics.averageRating.toFixed(1)}
          icon="revenue"
          color="violet"
        />
      </div>

      <SmeDashboardCharts />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              {t("operationsAlerts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-3 transition-colors hover:border-amber-200 hover:bg-amber-50/30"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-800">{product.name}</p>
                  <p className="text-xs text-stone-500">{t("stockDropped")}</p>
                </div>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  {t("stockValue", { value: product.stock })}
                </span>
              </div>
            ))}
            {SME_ORDERS.filter((order) => order.status === "ready_for_pickup").map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-100/50"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-800">{t("orderNumber", { id: order.id })}</p>
                  <p className="text-xs text-stone-500">{t("readyForPickupBy", { name: order.customerName })}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {t("ready")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4" />
              {t("actions.addProduct")}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4" />
              {t("actions.managePickupOrders")}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="h-4 w-4" />
              {t("actions.resolveLowStock")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <SmeProfileForm profile={SME_PROFILE} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("recentPickupRevenue")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SME_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-lg border border-stone-200 p-2 text-sm">
              <span>{t("orderNumber", { id: order.id })}</span>
              <span className="font-medium text-stone-900">{formatCurrency(order.totalPrice)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
