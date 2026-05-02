"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Pencil, Trash2, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SmeProductForm } from "@/features/sme/components/product-form";
import { SmeProductCard } from "@/features/sme/components/product-card";
import { getSmeProducts } from "@/features/sme/utils";
import { useTranslations } from "next-intl";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

const categories = ["all", "food", "craft", "service"] as const;

type ProductRow = ReturnType<typeof getSmeProducts>[number];

export default function ProdukPage() {
  const t = useTranslations("sme.products");
  const [products, setProducts] = useState(getSmeProducts());
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all");
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
          <p className="mt-0.5 text-sm text-on-surface/60">{t("subtitle")}</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("cancel") : t("addProduct")}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t("summary.totalProducts"), value: products.length, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: t("summary.published"), value: products.filter((p) => p.approvalStatus === "approved").length, color: "bg-primary/10 text-primary border-primary/100" },
          { label: t("summary.pending"), value: products.filter((p) => p.approvalStatus === "pending").length, color: "bg-surface-container-low text-on-surface/80 border-surface-container-high" },
          { label: t("summary.lowStock"), value: products.filter((p) => p.stock <= 5).length, color: "bg-red-50 text-red-700 border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedCategory === c
                ? "bg-amber-500 text-white"
                : "bg-surface-container text-on-surface/70 hover:bg-surface-container-high"
            }`}
          >
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>

      {/* Product DataTable */}
      <DataTable<ProductRow>
        data={filtered}
        columns={[
          {
            id: "name",
            header: t("tableHeaders.product") || "Produk",
            accessorFn: (row) => (
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-sm">{row.name}</p>
                  <p className="text-xs text-on-surface/60">{row.category}</p>
                </div>
              </div>
            ),
            sortable: true,
          },
          {
            id: "price",
            header: t("tableHeaders.price") || "Harga",
            accessorFn: (row) => (
              <span className="text-sm font-semibold text-amber-700">{formatCurrency(row.price)}</span>
            ),
            sortable: true,
          },
          {
            id: "stock",
            header: t("tableHeaders.stock") || "Stok",
            accessorFn: (row) => (
              <span className={`text-xs font-medium ${row.stock <= 5 ? "text-red-600" : "text-primary"}`}>
                {row.stock}
              </span>
            ),
            sortable: true,
          },
          {
            id: "partner",
            header: t("tableHeaders.partner") || "Mitra",
            accessorKey: "partnerName" as keyof ProductRow,
            hideOnMobile: true,
          },
          {
            id: "status",
            header: "Status",
            accessorFn: (row) => (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                row.approvalStatus === "approved"
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-container text-on-surface/70"
              }`}>
                {row.approvalStatus === "approved" ? t("status.approved") : t("status.pending")}
              </span>
            ),
            sortable: true,
          },
        ] satisfies ColumnDef<ProductRow>[]}
        keyExtractor={(row) => row.id}
        searchPlaceholder={t("searchPlaceholder")}
        searchableFields={["name" as keyof ProductRow, "category" as keyof ProductRow, "partnerName" as keyof ProductRow]}
        actions={(row) => [
          { label: t("edit"), icon: <Pencil className="h-4 w-4" />, onClick: () => {} },
          { label: t("deleteConfirmButton"), icon: <Trash2 className="h-4 w-4" />, onClick: () => setDeleteTarget(row.id), variant: "destructive" },
        ]}
        emptyState={{
          title: t("emptyTitle") || "Tidak ada produk",
          description: t("emptyDescription") || "Belum ada produk yang sesuai filter.",
        }}
      />

      <SmeProductForm open={showForm} onOpenChange={setShowForm} />

      <ConfirmationDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDescription")}
        confirmText={t("deleteConfirmButton")}
        variant="destructive"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {products.slice(0, 2).map((product) => (
          <SmeProductCard key={`summary-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  );
}
