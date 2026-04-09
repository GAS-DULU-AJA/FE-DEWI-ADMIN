"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, TrendingDown, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

const STOCK_ITEMS: StockItem[] = [
  { id: "1", name: "Keripik Singkong Rasa Pedas", category: "Makanan", currentStock: 3, minStock: 10, unit: "bungkus", price: 15000, lastRestocked: "2025-03-20" },
  { id: "2", name: "Madu Hutan Asli", category: "Makanan", currentStock: 2, minStock: 5, unit: "botol", price: 85000, lastRestocked: "2025-03-15" },
  { id: "3", name: "Batik Tulis Motif Kawung", category: "Kerajinan", currentStock: 12, minStock: 5, unit: "lembar", price: 250000, lastRestocked: "2025-04-01" },
  { id: "4", name: "Kopi Robusta Lokal 250g", category: "Minuman", currentStock: 20, minStock: 10, unit: "pack", price: 45000, lastRestocked: "2025-04-02" },
  { id: "5", name: "Sabun Herbal Kunyit", category: "Kesehatan", currentStock: 15, minStock: 8, unit: "buah", price: 25000, lastRestocked: "2025-03-28" },
];

export default function StokPage() {
  const t = useTranslations();
  const [stocks, setStocks] = useState(STOCK_ITEMS);

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Manajemen Stok</h1>
        <p className="mt-0.5 text-sm text-stone-500">Pantau dan kelola ketersediaan produk</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 text-center">
          <Package className="h-5 w-5 text-stone-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-stone-800">{stocks.length}</p>
          <p className="text-xs text-stone-500">Total Produk</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-700">{lowStock.length}</p>
          <p className="text-xs text-red-600">Stok Menipis</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <TrendingDown className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-700">{normalStock.length}</p>
          <p className="text-xs text-emerald-600">Stok Normal</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Produk Perlu Restok
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-stone-800">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    Sisa {item.currentStock} {item.unit} · Min. {item.minStock}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleRestock(item.id)}>
                  <RefreshCw className="h-3 w-3" />
                  Restok
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Full Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            Status Stok Semua Produk
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
                  <span className="text-[10px] text-stone-400">Harga {formatCurrency(item.price)}</span>
                  <span className="text-[10px] text-stone-400">Terakhir restok: {item.lastRestocked}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
