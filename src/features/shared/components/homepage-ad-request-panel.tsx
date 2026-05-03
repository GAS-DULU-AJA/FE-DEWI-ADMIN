"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import {
  formatAdPlacement,
  formatAdStatus,
  getAdStatusClassName,
  getHomepageAdRequestsByRole,
  summarizeAdRequests,
} from "@/features/shared/advertisement/utils";
import type {
  AdvertisementApprovalStatus,
  AdvertisementOwnerRole,
  HomepageAdvertisementRequest,
} from "@/features/shared/advertisement/types";

type Props = {
  role: AdvertisementOwnerRole;
};

export function HomepageAdRequestPanel({ role }: Props) {
  const locale = useLocale();
  const isId = locale === "id";
  const [requests, setRequests] = useState<HomepageAdvertisementRequest[]>(() => getHomepageAdRequestsByRole(role));

  const summary = summarizeAdRequests(requests);

  const updateStatus = (id: string, status: AdvertisementApprovalStatus, note?: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              requestedAt: status === "pending" ? new Date().toISOString().slice(0, 10) : request.requestedAt,
              note,
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
        id: "placement",
        header: isId ? "Placement" : "Placement",
        accessorFn: (row) => formatAdPlacement(row.placement, isId),
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: formatAdPlacement("hero", isId), value: "hero" },
          { label: formatAdPlacement("featured", isId), value: "featured" },
          { label: formatAdPlacement("sidebar", isId), value: "sidebar" },
        ],
      },
      {
        id: "requestedAt",
        header: isId ? "Tanggal Pengajuan" : "Requested Date",
        accessorFn: (row) => (row.requestedAt ? new Date(row.requestedAt).toLocaleDateString(locale) : "-"),
        sortable: true,
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorFn: (row) => formatAdStatus(row.status, isId),
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: formatAdStatus("draft", isId), value: "draft" },
          { label: formatAdStatus("pending", isId), value: "pending" },
          { label: formatAdStatus("approved", isId), value: "approved" },
          { label: formatAdStatus("rejected", isId), value: "rejected" },
        ],
      },
    ],
    [isId, locale],
  );

  const actions = (row: HomepageAdvertisementRequest): ActionItem[] => {
    const items: ActionItem[] = [];

    if (row.status === "draft" || row.status === "rejected") {
      items.push({
        label: isId ? "Ajukan Homepage" : "Submit to Homepage",
        onClick: () =>
          updateStatus(
            row.id,
            "pending",
            isId ? "Menunggu review Super Admin" : "Pending Super Admin review",
          ),
      });
    }

    if (row.status === "pending") {
      items.push({
        label: isId ? "Tarik Pengajuan" : "Withdraw",
        onClick: () => updateStatus(row.id, "draft", isId ? "Ditarik oleh pengaju" : "Withdrawn by requester"),
      });
    }

    return items;
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">
            {isId ? "Advertisement Homepage" : "Homepage Advertisement"}
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setRequests(getHomepageAdRequestsByRole(role))}>
            {isId ? "Reset Data" : "Reset Data"}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-container p-3 text-sm">
            <p className="text-on-surface/60">{isId ? "Total Request" : "Total Requests"}</p>
            <p className="mt-1 text-lg font-semibold text-on-surface">{summary.total}</p>
          </div>
          <div className="rounded-lg bg-surface-container p-3 text-sm">
            <p className="text-on-surface/60">{isId ? "Menunggu" : "Pending"}</p>
            <p className="mt-1 text-lg font-semibold text-amber-700">{summary.pending}</p>
          </div>
          <div className="rounded-lg bg-surface-container p-3 text-sm">
            <p className="text-on-surface/60">{isId ? "Disetujui" : "Approved"}</p>
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
          searchPlaceholder={isId ? "Cari request iklan..." : "Search ad requests..."}
          pageSize={6}
          actions={actions}
          mobileCardRenderer={(row) => (
            <div className="space-y-1">
              <p className="font-medium text-on-surface">{row.campaignName}</p>
              <div className="flex items-center gap-2 text-xs text-on-surface/60">
                <span>{formatAdPlacement(row.placement, isId)}</span>
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
