"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getExperiences } from "@/features/experience/utils";
import { VillagePageHeader } from "@/features/village/components/page-header";

type BundleStatus = "draft" | "active" | "expired";

type BundleItem = {
  id: string;
  name: string;
  experienceIds: string[];
  validFrom: string;
  validTo: string;
  originalPrice: number;
  bundlePrice: number;
  status: BundleStatus;
};

function getBundleStatusClassName(status: BundleStatus) {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "expired") return "bg-surface-container text-on-surface/60";
  return "bg-amber-100 text-amber-700";
}

export default function VillageBundlesPage() {
  const t = useTranslations("village");
  const locale = useLocale();
  const isId = locale === "id";
  const experiences = getExperiences();

  const [bundles, setBundles] = useState<BundleItem[]>([
    {
      id: "bundle-001",
      name: isId ? "Paket Wisata Budaya 2 Hari" : "2-Day Cultural Experience Package",
      experienceIds: experiences.slice(0, 2).map((item) => item.id),
      validFrom: "2026-05-05",
      validTo: "2026-06-30",
      originalPrice: 450000,
      bundlePrice: 360000,
      status: "active",
    },
    {
      id: "bundle-002",
      name: isId ? "Paket Keluarga Akhir Pekan" : "Weekend Family Package",
      experienceIds: experiences.slice(1, 4).map((item) => item.id),
      validFrom: "2026-05-10",
      validTo: "2026-05-28",
      originalPrice: 640000,
      bundlePrice: 540000,
      status: "draft",
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [bundleName, setBundleName] = useState("");
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState("10");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const priceMap = useMemo(
    () =>
      Object.fromEntries(
        experiences.map((experience) => [experience.id, experience.ticketTypes[0]?.price ?? 0]),
      ),
    [experiences],
  );

  const rows = useMemo(() => {
    return bundles.map((bundle) => {
      const experienceNames = bundle.experienceIds
        .map((id) => experiences.find((experience) => experience.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      return {
        ...bundle,
        experienceCount: bundle.experienceIds.length,
        discountPercent: bundle.originalPrice > 0
          ? Math.round(((bundle.originalPrice - bundle.bundlePrice) / bundle.originalPrice) * 100)
          : 0,
        experienceNames,
      };
    });
  }, [bundles, experiences]);

  const summary = {
    total: rows.length,
    active: rows.filter((row) => row.status === "active").length,
    avgDiscount: rows.length
      ? Math.round(rows.reduce((sum, row) => sum + row.discountPercent, 0) / rows.length)
      : 0,
  };

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(
    () => [
      {
        id: "name",
        header: isId ? "Nama Paket" : "Package Name",
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "experienceCount",
        header: isId ? "Jumlah Experience" : "Experiences",
        accessorFn: (row) => String(row.experienceCount),
        sortable: true,
      },
      {
        id: "bundlePrice",
        header: isId ? "Harga Bundle" : "Bundle Price",
        accessorFn: (row) => formatCurrency(row.bundlePrice),
        sortable: true,
      },
      {
        id: "discountPercent",
        header: isId ? "Diskon" : "Discount",
        accessorFn: (row) => `${row.discountPercent}%`,
        sortable: true,
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "draft", label: isId ? "Draft" : "Draft" },
          { value: "active", label: isId ? "Aktif" : "Active" },
          { value: "expired", label: isId ? "Kedaluwarsa" : "Expired" },
        ],
      },
    ],
    [formatCurrency, isId],
  );

  const actions = (row: (typeof rows)[number]): ActionItem[] => [
    {
      label: row.status === "active" ? (isId ? "Set Draft" : "Set Draft") : (isId ? "Aktifkan" : "Activate"),
      onClick: () => {
        setBundles((current) =>
          current.map((bundle) =>
            bundle.id === row.id
              ? { ...bundle, status: bundle.status === "active" ? "draft" : "active" }
              : bundle,
          ),
        );
      },
    },
  ];

  const toggleExperience = (id: string) => {
    setSelectedExperienceIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleCreateBundle = () => {
    if (!bundleName.trim() || selectedExperienceIds.length < 2 || !validFrom || !validTo) {
      return;
    }

    const originalPrice = selectedExperienceIds.reduce((sum, id) => sum + (priceMap[id] ?? 0), 0);
    const discountValue = Number(discountPercent) || 0;
    const bundlePrice = Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)));

    setBundles((current) => [
      {
        id: `bundle-${Date.now()}`,
        name: bundleName,
        experienceIds: selectedExperienceIds,
        validFrom,
        validTo,
        originalPrice,
        bundlePrice,
        status: "draft",
      },
      ...current,
    ]);

    setBundleName("");
    setSelectedExperienceIds([]);
    setDiscountPercent("10");
    setValidFrom("");
    setValidTo("");
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={isId ? "Paket Bundling Experience" : "Experience Bundling Packages"}
        description={
          isId
            ? "Gabungkan beberapa experience menjadi satu paket untuk meningkatkan daya tarik dan nilai transaksi wisatawan."
            : "Combine multiple experiences into attractive packages to increase conversion and traveler value."
        }
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: isId ? "Paket Bundling" : "Bundling Packages" },
        ]}
        action={
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            {isId ? "Buat Paket Bundle" : "Create Bundle Package"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Paket" : "Total Packages"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Paket Aktif" : "Active Packages"}</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-700">{summary.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Rata-rata Diskon" : "Average Discount"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{summary.avgDiscount}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Daftar Paket Bundling" : "Bundling Package List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["name", "experienceNames"]}
            searchPlaceholder={isId ? "Cari paket bundling..." : "Search bundling packages..."}
            pageSize={8}
            actions={actions}
            mobileCardRenderer={(row) => (
              <div className="space-y-1">
                <p className="font-medium text-on-surface">{row.name}</p>
                <p className="text-xs text-on-surface/60">{row.experienceCount} {isId ? "experience" : "experiences"}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-on-surface/70">{formatCurrency(row.bundlePrice)}</span>
                  <Badge className={getBundleStatusClassName(row.status)}>{row.status}</Badge>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isId ? "Buat Paket Bundling" : "Create Bundling Package"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bundle-name">{isId ? "Nama Paket" : "Package Name"}</Label>
              <Input
                id="bundle-name"
                value={bundleName}
                onChange={(event) => setBundleName(event.target.value)}
                placeholder={isId ? "Contoh: Paket Jelajah Desa 2 Hari" : "Example: 2-Day Village Explorer Package"}
              />
            </div>

            <div className="space-y-2">
              <Label>{isId ? "Pilih Experience (minimal 2)" : "Select Experiences (minimum 2)"}</Label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {experiences.map((experience) => {
                  const checked = selectedExperienceIds.includes(experience.id);
                  return (
                    <label
                      key={experience.id}
                      className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 ${
                        checked ? "border-primary/50 bg-primary/10" : "border-surface-container-high"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExperience(experience.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-on-surface">{experience.name}</p>
                        <p className="text-xs text-on-surface/60">
                          {formatCurrency(priceMap[experience.id] ?? 0)} · {experience.locationName}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="discount">{isId ? "Diskon (%)" : "Discount (%)"}</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={90}
                  value={discountPercent}
                  onChange={(event) => setDiscountPercent(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-from">{isId ? "Mulai Berlaku" : "Valid From"}</Label>
                <Input
                  id="valid-from"
                  type="date"
                  value={validFrom}
                  onChange={(event) => setValidFrom(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid-to">{isId ? "Berakhir" : "Valid To"}</Label>
                <Input
                  id="valid-to"
                  type="date"
                  value={validTo}
                  onChange={(event) => setValidTo(event.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {isId ? "Batal" : "Cancel"}
              </Button>
              <Button onClick={handleCreateBundle} disabled={selectedExperienceIds.length < 2 || !bundleName.trim()}>
                {isId ? "Simpan Bundle" : "Save Bundle"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
