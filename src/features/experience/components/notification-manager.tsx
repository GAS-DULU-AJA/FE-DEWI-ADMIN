"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/ui/form-modal";
import type { EventNotification, NotificationType } from "@/features/experience/types";
import { NOTIFICATION_TYPES } from "@/features/experience/constants";
import { useTranslations } from "next-intl";

export function NotificationManager({ notifications }: { notifications: EventNotification[] }) {
  const t = useTranslations("experience");
  const tc = useTranslations("common");
  const [showForm, setShowForm] = useState(false);
  const [notifType, setNotifType] = useState<NotificationType>("reminder");

  const statusColors: Record<string, string> = {
    draft: "bg-surface-container text-on-surface/70",
    scheduled: "bg-blue-100 text-blue-700",
    sent: "bg-primary/10 text-primary",
    failed: "bg-red-100 text-red-700",
  };

  const columns: ColumnDef<EventNotification>[] = [
    {
      id: "title",
      header: t("notifications.notifTitle"),
      accessorKey: "title",
      sortable: true,
    },
    {
      id: "type",
      header: t("notifications.type"),
      accessorKey: "type",
      sortable: true,
      filterable: true,
      filterOptions: NOTIFICATION_TYPES.map((type) => ({
        value: type,
        label: t(`notifications.types.${type}`),
      })),
      accessorFn: (row) => t(`notifications.types.${row.type}`),
    },
    {
      id: "status",
      header: tc("status"),
      accessorKey: "status",
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: "draft", label: t("notifications.statuses.draft") },
        { value: "scheduled", label: t("notifications.statuses.scheduled") },
        { value: "sent", label: t("notifications.statuses.sent") },
        { value: "failed", label: t("notifications.statuses.failed") },
      ],
      accessorFn: (row) => t(`notifications.statuses.${row.status}`),
    },
    {
      id: "recipientCount",
      header: "Recipients",
      accessorFn: (row) => String(row.recipientCount),
      sortable: true,
    },
    {
      id: "sentAt",
      header: tc("date"),
      accessorFn: (row) =>
        row.sentAt
          ? new Date(row.sentAt).toLocaleString()
          : row.scheduledAt
            ? new Date(row.scheduledAt).toLocaleString()
            : "-",
      sortable: true,
      hideOnMobile: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t("notifications.title")}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            {t("notifications.create")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormModal
          open={showForm}
          onOpenChange={setShowForm}
          title={t("notifications.create")}
          size="md"
          submitLabel={t("notifications.scheduleNow")}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("notifications.notifTitle")}</Label>
              <Input placeholder={t("notifications.titlePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("notifications.type")}</Label>
              <select
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as NotificationType)}
              >
                {NOTIFICATION_TYPES.map((nt) => (
                  <option key={nt} value={nt}>{t(`notifications.types.${nt}`)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("notifications.message")}</Label>
            <Textarea rows={3} placeholder={t("notifications.messagePlaceholder")} />
          </div>
          <div className="space-y-2">
            <Label>{t("notifications.scheduleAt")}</Label>
            <Input type="datetime-local" />
          </div>
        </FormModal>

        <DataTable
          data={notifications}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchableFields={["title", "message", "type", "status"]}
          searchPlaceholder={`${tc("search")}...`}
          pageSize={10}
          emptyState={{ title: t("notifications.empty") }}
          mobileCardRenderer={(notif) => (
            <div className="rounded-lg border border-surface-container-high p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-on-surface">{notif.title}</p>
                <Badge className={statusColors[notif.status] ?? ""}>{t(`notifications.statuses.${notif.status}`)}</Badge>
              </div>
              <p className="mt-1 text-on-surface/70">{notif.message}</p>
              <div className="mt-1.5 flex gap-3 text-xs text-on-surface/60">
                <span>{t(`notifications.types.${notif.type}`)}</span>
                <span>{t("notifications.recipients", { count: notif.recipientCount })}</span>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
