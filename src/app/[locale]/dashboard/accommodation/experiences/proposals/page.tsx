"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { getExperiences } from "@/features/experience";
import type { ExperienceItem } from "@/features/experience/types";
import { CalendarDays, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function AccommodationProposalsPage() {
  const t = useTranslations("experience");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isId = locale === "id";

  // Filter only proposals (non-published items that need approval)
  const experiences = getExperiences().filter(
    (e) => e.status !== "published" && e.status !== "completed" && e.status !== "closed"
  );

  const columns = useMemo<ColumnDef<ExperienceItem>[]>(
    () => [
      {
        id: "name",
        header: tc("name"),
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "draft", label: t("status.draft") },
          { value: "proposal_sent", label: t("status.proposal_sent") },
          { value: "under_review", label: t("status.under_review") },
          { value: "changes_requested", label: t("status.changes_requested") },
          { value: "village_approved", label: t("status.village_approved") },
          { value: "rejected", label: t("status.rejected") },
        ],
        accessorFn: (row) => t(`status.${row.status}`),
      },
      {
        id: "scheduleStart",
        header: t("detail.schedule"),
        accessorKey: "scheduleStart",
        sortable: true,
        accessorFn: (row) => new Date(row.scheduleStart).toLocaleDateString(locale),
      },
    ],
    [locale, t, tc],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">
          {isId ? "Status Proposal" : "Proposal Status"}
        </h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">
          {isId
            ? "Lacak status persetujuan experience yang Anda ajukan"
            : "Track the approval status of your submitted experiences"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isId ? "Daftar Proposal" : "Proposal List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={experiences}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["name", "shortDescription"]}
            searchPlaceholder={isId ? "Cari proposal..." : "Search proposals..."}
            pageSize={10}
            emptyState={{
              icon: <FileText className="h-10 w-10" />,
              title: isId ? "Belum ada proposal" : "No proposals yet",
              description: isId
                ? "Buat experience baru untuk mengajukan proposal ke Pengelola Desa"
                : "Create a new experience to submit a proposal to the Village Admin",
            }}
            mobileCardRenderer={(row) => (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{row.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-on-surface/70">
                  <p>{t(`status.${row.status}`)}</p>
                  <p>
                    <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
                    {new Date(row.scheduleStart).toLocaleDateString(locale)}
                  </p>
                </CardContent>
              </Card>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
