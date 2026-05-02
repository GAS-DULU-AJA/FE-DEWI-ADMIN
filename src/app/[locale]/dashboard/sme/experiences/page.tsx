"use client";

import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { ExperienceCard, getExperiences, EXPERIENCE_CATEGORIES } from "@/features/experience";
import type { ExperienceItem } from "@/features/experience/types";
import { CalendarDays, Plus, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function SmeExperiencesPage() {
  const t = useTranslations("experience");
  const tc = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const isId = locale === "id";

  const experiences = getExperiences();

  const columns = useMemo<ColumnDef<ExperienceItem>[]>(
    () => [
      {
        id: "name",
        header: tc("name"),
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "category",
        header: t("components.category"),
        accessorKey: "category",
        sortable: true,
        filterable: true,
        filterOptions: EXPERIENCE_CATEGORIES.map((category) => ({
          label: t(`categories.${category}`),
          value: category,
        })),
        accessorFn: (row) => t(`categories.${row.category}`),
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: t("status.draft"), value: "draft" },
          { label: t("status.proposal_sent"), value: "proposal_sent" },
          { label: t("status.under_review"), value: "under_review" },
          { label: t("status.changes_requested"), value: "changes_requested" },
          { label: t("status.village_approved"), value: "village_approved" },
          { label: t("status.published"), value: "published" },
          { label: t("status.rejected"), value: "rejected" },
        ],
        accessorFn: (row) => t(`status.${row.status}`),
      },
      {
        id: "scheduleStart",
        header: t("detail.schedule"),
        accessorKey: "scheduleStart",
        sortable: true,
        accessorFn: (row) => new Date(row.scheduleStart).toLocaleDateString(locale),
        hideOnMobile: true,
      },
      {
        id: "bookings",
        header: t("components.bookings"),
        accessorFn: (row) => `${row.totalBookings}/${row.totalCapacity}`,
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [locale, t, tc],
  );

  const actions = (row: ExperienceItem): ActionItem[] => [
    {
      label: tc("view"),
      onClick: () => router.push(`/dashboard/sme/experiences/${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">
            {isId ? "Kelola Experience" : "Manage Experiences"}
          </h1>
          <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">
            {isId
              ? "Buat dan kelola experience yang terkait dengan UMKM Anda"
              : "Create and manage experiences related to your business"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sme/experiences/add">
            <Plus className="mr-2 h-4 w-4" />
            {isId ? "Tambah Experience" : "Add Experience"}
          </Link>
        </Button>
      </div>

      {/* Approval info */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 py-3">
          <Clock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            {isId
              ? "Experience yang Anda buat memerlukan persetujuan dari Pengelola Desa sebelum dipublikasikan."
              : "Experiences you create require Village Admin approval before being published."}
          </p>
        </CardContent>
      </Card>

      <DataTable
        data={experiences}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["name", "shortDescription", "locationName"]}
        searchPlaceholder={isId ? "Cari experience..." : "Search experiences..."}
        pageSize={10}
        onRowClick={(row) => router.push(`/dashboard/sme/experiences/${row.id}`)}
        actions={actions}
        emptyState={{
          icon: <CalendarDays className="h-10 w-10" />,
          title: isId ? "Belum ada experience" : "No experiences yet",
          description: isId
            ? "Mulai buat experience untuk mempromosikan produk UMKM Anda"
            : "Start creating experiences to promote your products",
          action: {
            label: isId ? "Tambah Experience" : "Add Experience",
            onClick: () => router.push("/dashboard/sme/experiences/add"),
          },
        }}
        mobileCardRenderer={(row) => (
          <div className="space-y-2">
            <ExperienceCard experience={row} />
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/sme/experiences/${row.id}`}>
                {isId ? "Detail" : "View Details"}
              </Link>
            </Button>
          </div>
        )}
      />
    </div>
  );
}
