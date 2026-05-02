"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef, type ActionItem } from "@/components/ui/data-table";
import type { ExperienceReservation } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function AttendeeTable({ reservations }: { reservations: ExperienceReservation[] }) {
  const t = useTranslations("experience");

  const stats = useMemo(() => {
    const total = reservations.reduce((sum, r) => sum + r.quantity, 0);
    const checkedIn = reservations.filter((r) => r.bookingStatus === "checked_in").reduce((sum, r) => sum + r.quantity, 0);
    const noShow = reservations.filter((r) => r.bookingStatus === "no_show").reduce((sum, r) => sum + r.quantity, 0);
    const cancelled = reservations.filter((r) => r.bookingStatus === "cancelled").reduce((sum, r) => sum + r.quantity, 0);
    return { total, checkedIn, noShow, cancelled };
  }, [reservations]);

  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    checked_in: "bg-primary/10 text-primary",
    no_show: "bg-red-100 text-red-700",
    cancelled: "bg-surface-container text-on-surface/60",
  };

  const columns = useMemo((): ColumnDef<ExperienceReservation>[] => [
    {
      id: "customerName",
      header: t("attendees.name"),
      accessorKey: "customerName",
      sortable: true,
      accessorFn: (row) => <span className="font-medium text-on-surface">{row.customerName}</span>,
    },
    {
      id: "customerEmail",
      header: t("attendees.emailCol"),
      accessorKey: "customerEmail",
      hideOnMobile: true,
    },
    {
      id: "ticketTypeName",
      header: t("attendees.ticket"),
      accessorKey: "ticketTypeName",
      sortable: true,
      filterable: true,
    },
    {
      id: "quantity",
      header: t("attendees.qty"),
      accessorKey: "quantity",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "qrCode",
      header: t("attendees.qrCode"),
      accessorKey: "qrCode",
      hideOnMobile: true,
      accessorFn: (row) => (
        <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs">{row.qrCode}</code>
      ),
    },
    {
      id: "bookingStatus",
      header: t("attendees.status"),
      accessorKey: "bookingStatus",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("bookingStatus.confirmed"), value: "confirmed" },
        { label: t("bookingStatus.checked_in"), value: "checked_in" },
        { label: t("bookingStatus.no_show"), value: "no_show" },
        { label: t("bookingStatus.cancelled"), value: "cancelled" },
      ],
      accessorFn: (row) => (
        <Badge className={statusColors[row.bookingStatus] ?? ""}>
          {t(`bookingStatus.${row.bookingStatus}`)}
        </Badge>
      ),
    },
  ], [t]);

  const actions = (row: ExperienceReservation): ActionItem[] => {
    const items: ActionItem[] = [];
    if (row.bookingStatus === "confirmed") {
      items.push({ label: t("attendees.checkIn"), onClick: () => {} });
    }
    if (row.eTicketUrl) {
      items.push({ label: t("attendees.viewTicket"), onClick: () => {} });
    }
    return items;
  };

  const mobileCardRenderer = (row: ExperienceReservation) => (
    <div className="space-y-1 p-1">
      <p className="font-semibold text-on-surface">{row.customerName}</p>
      <p className="text-xs text-on-surface/60">{row.customerEmail}</p>
      <p className="text-xs text-on-surface/70">{row.ticketTypeName} · ×{row.quantity}</p>
      <Badge className={statusColors[row.bookingStatus] ?? ""}>
        {t(`bookingStatus.${row.bookingStatus}`)}
      </Badge>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("attendees.title")}</CardTitle>
        <div className="flex flex-wrap gap-3 text-xs text-on-surface/60">
          <span>{t("attendees.total")}: {stats.total}</span>
          <span>{t("attendees.checkedIn")}: {stats.checkedIn}</span>
          <span>{t("attendees.noShow")}: {stats.noShow}</span>
          <span>{t("attendees.cancelled")}: {stats.cancelled}</span>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={reservations}
          columns={columns}
          keyExtractor={(r) => r.id}
          searchableFields={["customerName", "customerEmail", "qrCode"]}
          searchPlaceholder={t("attendees.searchPlaceholder")}
          actions={actions}
          mobileCardRenderer={mobileCardRenderer}
          pageSize={10}
          emptyState={{
            title: "No attendees found",
          }}
          toolbarExtra={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">{t("attendees.exportCsv")}</Button>
              <Button variant="outline" size="sm">{t("attendees.sendBulkNotification")}</Button>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
