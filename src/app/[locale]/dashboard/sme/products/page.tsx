"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Plus, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SmeProductForm, SmeProductCard, getSmeProducts } from "@/features/sme";
import { useTranslations } from "next-intl";

const categories = ["all", "food", "craft", "service"] as const;

export default function ProdukPage() {
  const t = useTranslations("sme.products");
  const [products, setProducts] = useState(getSmeProducts());
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-stone-500">{t("subtitle")}</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {t("addProduct")}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t("summary.totalProducts"), value: products.length, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: t("summary.published"), value: products.filter((p) => p.approvalStatus === "approved").length, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: t("summary.pending"), value: products.filter((p) => p.approvalStatus === "pending").length, color: "bg-stone-50 text-stone-700 border-stone-200" },
          { label: t("summary.lowStock"), value: products.filter((p) => p.stock <= 5).length, color: "bg-red-50 text-red-700 border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === c
                  ? "bg-amber-500 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <ShoppingBag className="h-5 w-5 text-amber-600" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  product.approvalStatus === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-600"
                }`}>
                  {product.approvalStatus === "approved" ? t("status.approved") : t("status.pending")}
                </span>
              </div>
              <h3 className="font-semibold text-stone-900 text-sm">{product.name}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{product.category}</p>
              <p className="text-xs text-stone-400 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-semibold text-amber-700">{formatCurrency(product.price)}</p>
                <span className={`text-xs font-medium ${product.stock <= 5 ? "text-red-600" : "text-emerald-600"}`}>
                  {t("stockValue", { value: product.stock })}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">{t("partnerValue", { name: product.partnerName })}</p>
              <div className="flex gap-2 mt-3 pt-3 border-t border-stone-100">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="h-3 w-3" />
                  {t("edit")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SmeProductForm />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {products.slice(0, 2).map((product) => (
          <SmeProductCard key={`summary-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  );
}
