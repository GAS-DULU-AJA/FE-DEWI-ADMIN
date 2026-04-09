"use client";

import { useTranslations } from "next-intl";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, AlertTriangle, Package, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PRODUCTS = [
  { id: "1", name: "Keripik Singkong Rasa Pedas", category: "Makanan", price: 15000, stock: 3, sold: 148 },
  { id: "2", name: "Batik Tulis Motif Kawung", category: "Kerajinan", price: 250000, stock: 12, sold: 32 },
  { id: "3", name: "Madu Hutan Asli", category: "Makanan", price: 85000, stock: 2, sold: 97 },
  { id: "4", name: "Kopi Robusta Lokal 250g", category: "Minuman", price: 45000, stock: 20, sold: 215 },
];

const ORDERS = [
  { id: "1", buyer: "Dewi Lestari", product: "Kopi Robusta Lokal 250g", qty: 2, total: 90000, status: "delivered" },
  { id: "2", buyer: "Andi Nugroho", product: "Madu Hutan Asli", qty: 1, total: 85000, status: "processing" },
  { id: "3", buyer: "Sari W.", product: "Keripik Singkong Rasa Pedas", qty: 5, total: 75000, status: "pending" },
];

const orderStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-amber-100 text-amber-700" },
  processing: { label: "Diproses", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Terkirim", color: "bg-emerald-100 text-emerald-700" },
};

export default function UmkmDashboard() {
  const t = useTranslations();
  const lowStockItems = PRODUCTS.filter((p) => p.stock <= 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("partner.umkm")}</h1>
          <p className="text-sm text-stone-500 mt-0.5">Sentra Produk Desa — April 2025</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("dashboard.totalProducts")} value={PRODUCTS.length} icon="products" color="amber" />
        <StatCard label={t("dashboard.monthlySales")} value="Rp 4,2jt" change={22} icon="revenue" color="emerald" />
        <StatCard label={t("dashboard.totalOrders")} value={3} icon="partners" color="blue" />
        <StatCard label="Stok Menipis" value={lowStockItems.length} icon="products" color="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-amber-600" />
              {t("products.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-3">
                <div>
                  <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                  <p className="text-xs text-stone-500">{p.category} · Terjual {p.sold} · {formatCurrency(p.price)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.stock <= 3 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                  Stok {p.stock}
                </span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-1">
              <Plus className="h-3 w-3" />
              {t("products.add")}
            </Button>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ORDERS.map((o) => {
              const s = orderStatusMap[o.status];
              return (
                <div key={o.id} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{o.buyer}</p>
                      <p className="text-xs text-stone-500">{o.product} × {o.qty}</p>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span>
                      <p className="mt-1 text-xs font-medium text-amber-700">{formatCurrency(o.total)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Peringatan Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                  <span className="text-sm font-medium text-stone-800">{p.name}</span>
                  <span className="text-xs font-semibold text-red-600">Sisa {p.stock} pcs</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
