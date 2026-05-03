"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import {
  formatAdPlacement,
  formatAdRole,
  formatAdStatus,
  getAdStatusClassName,
  getHomepageAdRequests,
  summarizeAdRequests,
} from "@/features/shared/advertisement/utils";
import type { HomepageAdvertisementRequest } from "@/features/shared/advertisement/types";

export function HomepageAdApprovalPanel() {
  const locale = useLocale();
  const isId = locale === "id";
  const [requests, setRequests] = useState<HomepageAdvertisementRequest[]>(getHomepageAdRequests());

  const summary = summarizeAdRequests(requests);

  const updateRequest = (id: string, approved: boolean) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: approved ? "approved" : "rejected",
              note: approved
                ? isId
                  ? "Disetujui untuk tampil di homepage"
                  : "Approved to be shown on homepage"
                : isId
                  ? "Ditolak Super Admin, mohon revisi materi"
                  : "Rejected by Super Admin, revise campaign assets",
            }
          : request,
      ),
    );
  };

  const columns = useMemo<ColumnDef<HomepageAdvertisementRequest>[]>(
    () => [
      {
        id: "campaignName",
        header: isId ? "Kampanye" : "Campaign",
        accessorKey: "campaignName",
        sortable: true,
      },
      {
        id: "role",
        header: isId ? "Role" : "Role",
        accessorFn: (row) => formatAdRole(row.role, isId),
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: formatAdRole("village", isId), value: "village" },
          { label: formatAdRole("accommodation", isId), value: "accommodation" },
          { label: formatAdRole("sme", isId), value: "sme" },
          { label: formatAdRole("experience", isId), value: "experience" },
          { label: formatAdRole("transport", isId), value: "transport" },
        ],
      },
      {
        id: "placement",
        header: isId ? "Placement" : "Placement",
        accessorFn: (row) => formatAdPlacement(row.placement, isId),
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorFn: (row) => formatAdStatus(row.status, isId),
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: formatAdStatus("pending", isId), value: "pending" },
          { label: formatAdStatus("approved", isId), value: "approved" },
          { label: formatAdStatus("rejected", isId), value: "rejected" },
          { label: formatAdStatus("draft", isId), value: "draft" },
        ],
      },
      {
        id: "requestedAt",
        header: isId ? "Tanggal" : "Date",
        accessorFn: (row) => (row.requestedAt ? new Date(row.requestedAt).toLocaleDateString(locale) : "-"),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [isId, locale],
  );

  const actions = (row: HomepageAdvertisementRequest): ActionItem[] => {
    if (row.status !== "pending") {
      return [];
    }

    return [
      {
        label: isId ? "Approve" : "Approve",
        onClick: () => updateRequest(row.id, true),
      },
      {
        label: isId ? "Reject" : "Reject",
        onClick: () => updateRequest(row.id, false),
      },
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {isId ? "Persetujuan Advertisement Homepage" : "Homepage Advertisement Approval"}
        </CardTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-container p-3 text-sm">
            <p className="text-on-surface/60">{isId ? "Total Pengajuan" : "Total Requests"}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">{summary.total}</p>
          </div>
          <div className="rounded-lg bg-surface-container p-3 text-sm">
            <p className="text-on-surface/60">{isId ? "Menunggu Persetujuan" : "Pending Approval"}</p>
            <p className="mt-1 text-lg font-semibold text-amber-700">{summary.pending}</p>
          </div>
          <div className="rounded-lg bg-surface-container p-3 text-sm">
            <p className="text-on-surface/60">{isId ? "Sudah Disetujui" : "Approved"}</p>
            <p className="mt-1 text-lg font-semibold text-emerald-700">{summary.approved}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={requests}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchableFields={["campaignName", "requestedBy", "note"]}
          searchPlaceholder={isId ? "Cari iklan..." : "Search advertisements..."}
          pageSize={8}
          actions={actions}
          mobileCardRenderer={(row) => (
            <div className="space-y-1">
              <p className="font-medium text-on-surface">{row.campaignName}</p>
              <div className="flex items-center gap-2 text-xs text-on-surface/60">
                <span>{formatAdRole(row.role, isId)}</span>
                <Badge className={getAdStatusClassName(row.status)}>{formatAdStatus(row.status, isId)}</Badge>
              </div>
              <p className="text-xs text-on-surface/50">{row.note ?? "-"}</p>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
