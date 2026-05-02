"use client";

import { useMemo } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { ExperienceCard, EXPERIENCE_CATEGORIES, getExperiences } from "@/features/experience";
import type { ExperienceItem } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export default function ExperienceEventsPage() {
  const t = useTranslations("experience");
  const tc = useTranslations("common");
  const router = useRouter();
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
          { label: t("status.published"), value: "published" },
          { label: t("status.ticket_sales_open"), value: "ticket_sales_open" },
          { label: t("status.ongoing"), value: "ongoing" },
          { label: t("status.completed"), value: "completed" },
          { label: t("status.cancelled"), value: "cancelled" },
        ],
        accessorFn: (row) => t(`status.${row.status}`),
      },
      {
        id: "schedule",
        header: t("detail.schedule"),
        accessorFn: (row) => new Date(row.scheduleStart).toLocaleDateString(),
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "bookings",
        header: t("components.bookings"),
        accessorFn: (row) => String(row.totalBookings),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [t, tc],
  );

  const actions = (row: ExperienceItem): ActionItem[] => [
    {
      label: t("events.openDetail"),
      onClick: () => router.push(`/dashboard/experience/events/${row.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("events.title")}</h1>
          <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("events.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/experience/events/add">{t("events.add")}</Link>
        </Button>
      </div>

      <DataTable
        data={experiences}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchableFields={["name", "description", "locationName"]}
        searchPlaceholder={t("events.searchPlaceholder")}
        pageSize={10}
        onRowClick={(row) => router.push(`/dashboard/experience/events/${row.id}`)}
        actions={actions}
        mobileCardRenderer={(row) => (
          <div className="space-y-2">
            <ExperienceCard experience={row} />
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/experience/events/${row.id}`}>{t("events.openDetail")}</Link>
            </Button>
          </div>
        )}
      />
    </div>
  );
}
