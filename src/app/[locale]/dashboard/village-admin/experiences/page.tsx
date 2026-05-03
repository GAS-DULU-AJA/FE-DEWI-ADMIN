"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { getExperiences } from "@/features/experience/utils";
import type { ExperienceItem } from "@/features/experience/types";

export default function ExperiencesPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const router = useRouter();
  const experiences = getExperiences();
  const activeExperiences = experiences.filter(
    (item) => item.status === "published" || item.status === "ticket_sales_open" || item.status === "ongoing",
  ).length;
  const totalBookings = experiences.reduce((sum, item) => sum + item.totalBookings, 0);
  const avgRating = experiences.length
    ? (experiences.reduce((sum, item) => sum + item.averageRating, 0) / experiences.length).toFixed(1)
    : "0.0";

  const categoryLabelByValue: Record<ExperienceItem["category"], string> = {
    cultural: t("experiences.categories.cultural"),
    nature: t("experiences.categories.nature"),
    culinary: t("experiences.categories.culinary"),
    craft: t("experiences.categories.craft"),
    adventure: t("experiences.categories.adventure"),
    wellness: t("experiences.categories.wellness"),
    education: t("experiences.categories.education"),
    festival: t("experiences.categories.festival"),
    photography: t("experiences.categories.photography"),
    agro_tourism: t("experiences.categories.agro_tourism"),
    sport: t("experiences.categories.sport"),
    other: t("experiences.categories.other"),
  };

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
        header: t("experiences.category"),
        accessorKey: "category",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: t("experiences.categories.cultural"), value: "cultural" },
          { label: t("experiences.categories.nature"), value: "nature" },
          { label: t("experiences.categories.culinary"), value: "culinary" },
          { label: t("experiences.categories.craft"), value: "craft" },
          { label: t("experiences.categories.adventure"), value: "adventure" },
          { label: t("experiences.categories.wellness"), value: "wellness" },
          { label: t("experiences.categories.festival"), value: "festival" },
          { label: t("experiences.categories.photography"), value: "photography" },
          { label: t("experiences.categories.agro_tourism"), value: "agro_tourism" },
          { label: t("experiences.categories.sport"), value: "sport" },
          { label: t("experiences.categories.education"), value: "education" },
          { label: t("experiences.categories.other"), value: "other" },
        ],
        accessorFn: (row) => categoryLabelByValue[row.category] ?? t("experiences.categories.other"),
        hideOnMobile: true,
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: t("experiences.statuses.draft"), value: "draft" },
          { label: t("experiences.statuses.published"), value: "published" },
          { label: t("experiences.statuses.ticket_sales_open"), value: "ticket_sales_open" },
          { label: t("experiences.statuses.ongoing"), value: "ongoing" },
          { label: t("experiences.statuses.completed"), value: "completed" },
          { label: t("experiences.statuses.cancelled"), value: "cancelled" },
        ],
        accessorFn: (row) => t(`experiences.statuses.${row.status}`),
      },
      {
        id: "schedule",
        header: t("experiences.scheduleLabel"),
        accessorFn: (row) => new Date(row.scheduleStart).toLocaleDateString(locale),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [categoryLabelByValue, t, tc, locale],
  );

  const getActions = (row: ExperienceItem): ActionItem[] => [
    {
      label: t("actions.viewDetail"),
      onClick: () => {
        router.push(`/dashboard/village-admin/experiences/${row.id}`);
      },
    },
  ];

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.title")}
        description={
          isId
            ? "Kelola experience milik desa. Experience yang dibuat oleh pengelola desa tidak perlu approval tambahan."
            : "Manage village-owned experiences. Experiences created by village managers do not require additional approval."
        }
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences") },
        ]}
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/proposals">{isId ? "Persetujuan Proposal" : "Proposal Approvals"}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/speakers">Speakers</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/calendar">{t("breadcrumbs.calendar")}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/analytics">{t("experiences.analyticsTitle")}</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/attendees">{t("experiences.attendeesTitle")}</Link></Button>
            <Button asChild><Link href="/dashboard/village-admin/experiences/add">{isId ? "Buat Experience Desa" : "Create Village Experience"}</Link></Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Experience" : "Total Experiences"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{experiences.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Experience Aktif" : "Active Experiences"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{activeExperiences}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-on-surface/60">{isId ? "Total Booking & Rating" : "Bookings & Rating"}</p>
            <p className="mt-1 text-2xl font-semibold text-on-surface">{totalBookings.toLocaleString()} · ⭐ {avgRating}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Daftar Experience & Tiket" : "Experience & Ticket List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={experiences}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["name", "locationName", "description"]}
            searchPlaceholder={`${tc("search")}...`}
            pageSize={10}
            actions={getActions}
            mobileCardRenderer={(row) => <VillageExperienceCard experience={row} t={t} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function VillageExperienceCard({ experience, t }: { experience: ExperienceItem; t: ReturnType<typeof useTranslations> }) {
  const isActive = experience.status === "published" || experience.status === "ticket_sales_open" || experience.status === "ongoing";
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{experience.name}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {t(`experiences.statuses.${experience.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-on-surface/70">
        <p>{experience.shortDescription}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface/60">
          <span>{experience.locationName}</span>
          <span>{new Date(experience.scheduleStart).toLocaleDateString()}</span>
          <span>{t("experiences.bookedOf", { booked: experience.totalBookings, capacity: experience.totalCapacity })}</span>
          <span>⭐ {experience.averageRating}/5</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/village-admin/experiences/${experience.id}`}>{t("actions.viewDetail")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
