"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, TrendingDown, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  StockIndicator,
  getSmeProducts,
  getSmeStockAdjustments,
} from "@/features/sme";

type StockItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  lastRestocked: string;
};

const STOCK_ITEMS: StockItem[] = getSmeProducts().map((product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  currentStock: product.stock,
  minStock: 5,
  unit: "pcs",
  price: product.price,
  lastRestocked: product.updatedAt,
}));

export default function StokPage() {
  const t = useTranslations("sme.stock");
  const [stocks, setStocks] = useState(STOCK_ITEMS);
  const adjustments = getSmeStockAdjustments();

  const lowStock = stocks.filter((s) => s.currentStock <= s.minStock);
  const normalStock = stocks.filter((s) => s.currentStock > s.minStock);

  const handleRestock = (id: string) => {
    setStocks((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, currentStock: s.minStock * 3, lastRestocked: "2025-04-08" } : s
      )
    );
  };

  const getStockPercent = (item: StockItem) =>
    Math.min(100, Math.round((item.currentStock / (item.minStock * 3)) * 100));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 text-center">
          <Package className="h-5 w-5 text-stone-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-stone-800">{stocks.length}</p>
          <p className="text-xs text-stone-500">{t("summary.totalProducts")}</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-700">{lowStock.length}</p>
          <p className="text-xs text-red-600">{t("summary.lowStock")}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <TrendingDown className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-700">{normalStock.length}</p>
          <p className="text-xs text-emerald-600">{t("summary.healthyStock")}</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t("restockAlerts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-stone-800">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    {t("remaining", { stock: item.currentStock, unit: item.unit, min: item.minStock })}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleRestock(item.id)}>
                  <RefreshCw className="h-3 w-3" />
                  {t("restock")}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            {t("fullSnapshot")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stocks.map((item) => {
            const pct = getStockPercent(item);
            const isLow = item.currentStock <= item.minStock;
            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-stone-800">{item.name}</span>
                    <span className="ml-2 text-xs text-stone-400">· {item.category}</span>
                  </div>
                  <span className={`text-xs font-semibold ${isLow ? "text-red-600" : "text-emerald-600"}`}>
                    {item.currentStock}/{item.minStock * 3} {item.unit}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-200">
                  <div
                    className={`h-full rounded-full transition-all ${pct <= 30 ? "bg-red-500" : pct <= 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">{t("priceValue", { value: formatCurrency(item.price) })}</span>
                  <span className="text-[10px] text-stone-400">{t("lastRestock", { date: item.lastRestocked })}</span>
                </div>
                <StockIndicator stock={item.currentStock} threshold={item.minStock} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("adjustmentHistory")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {adjustments.map((adjustment) => (
            <div key={adjustment.id} className="flex items-center justify-between rounded-lg border border-stone-200 p-2 text-sm">
              <div>
                <p className="font-medium text-stone-900">{adjustment.productName}</p>
                <p className="text-xs text-stone-500">{adjustment.reason}</p>
              </div>
              <p className={adjustment.type === "in" ? "text-emerald-700" : "text-red-700"}>
                {adjustment.type === "in" ? "+" : "-"}
                {adjustment.quantity}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
