"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/ui/form-modal";
import type { EventNotification, NotificationType } from "@/features/experience/types";
import { NOTIFICATION_TYPES } from "@/features/experience/constants";
import { useTranslations } from "next-intl";

export function NotificationManager({ notifications }: { notifications: EventNotification[] }) {
  const t = useTranslations("experience");
  const [showForm, setShowForm] = useState(false);
  const [notifType, setNotifType] = useState<NotificationType>("reminder");

  const statusColors: Record<string, string> = {
    draft: "bg-stone-100 text-stone-600",
    scheduled: "bg-blue-100 text-blue-700",
    sent: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
  };

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
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
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

        {notifications.length === 0 ? (
          <p className="text-sm text-stone-500">{t("notifications.empty")}</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="rounded-lg border border-stone-200 p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-stone-900">{notif.title}</p>
                <Badge className={statusColors[notif.status] ?? ""}>{t(`notifications.statuses.${notif.status}`)}</Badge>
              </div>
              <p className="mt-1 text-stone-600">{notif.message}</p>
              <div className="mt-1.5 flex gap-3 text-xs text-stone-500">
                <span>{t(`notifications.types.${notif.type}`)}</span>
                <span>{t("notifications.recipients", { count: notif.recipientCount })}</span>
                {notif.sentAt && <span>{t("notifications.sentAt")}: {new Date(notif.sentAt).toLocaleString()}</span>}
                {notif.scheduledAt && !notif.sentAt && <span>{t("notifications.scheduledFor")}: {new Date(notif.scheduledAt).toLocaleString()}</span>}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
