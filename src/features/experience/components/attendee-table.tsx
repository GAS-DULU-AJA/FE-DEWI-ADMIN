"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ExperienceReservation } from "@/features/experience/types";
import { useTranslations } from "next-intl";

export function AttendeeTable({ reservations }: { reservations: ExperienceReservation[] }) {
  const t = useTranslations("experience");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesQuery =
        r.customerName.toLowerCase().includes(query.toLowerCase()) ||
        r.customerEmail.toLowerCase().includes(query.toLowerCase()) ||
        r.qrCode.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.bookingStatus === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [reservations, query, statusFilter]);

  const stats = useMemo(() => {
    const total = reservations.reduce((sum, r) => sum + r.quantity, 0);
    const checkedIn = reservations.filter((r) => r.bookingStatus === "checked_in").reduce((sum, r) => sum + r.quantity, 0);
    const noShow = reservations.filter((r) => r.bookingStatus === "no_show").reduce((sum, r) => sum + r.quantity, 0);
    const cancelled = reservations.filter((r) => r.bookingStatus === "cancelled").reduce((sum, r) => sum + r.quantity, 0);
    return { total, checkedIn, noShow, cancelled };
  }, [reservations]);

  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    checked_in: "bg-emerald-100 text-emerald-700",
    no_show: "bg-red-100 text-red-700",
    cancelled: "bg-stone-100 text-stone-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("attendees.title")}</CardTitle>
        <div className="flex flex-wrap gap-3 text-xs text-stone-500">
          <span>{t("attendees.total")}: {stats.total}</span>
          <span>{t("attendees.checkedIn")}: {stats.checkedIn}</span>
          <span>{t("attendees.noShow")}: {stats.noShow}</span>
          <span>{t("attendees.cancelled")}: {stats.cancelled}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder={t("attendees.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-1">
            {["all", "confirmed", "checked_in", "no_show", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-2.5 py-1 text-xs ${statusFilter === s ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-600"}`}
              >
                {s === "all" ? t("events.all") : t(`bookingStatus.${s}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs text-stone-500">
                <th className="px-3 py-2">{t("attendees.name")}</th>
                <th className="px-3 py-2">{t("attendees.emailCol")}</th>
                <th className="px-3 py-2">{t("attendees.ticket")}</th>
                <th className="px-3 py-2">{t("attendees.qty")}</th>
                <th className="px-3 py-2">{t("attendees.qrCode")}</th>
                <th className="px-3 py-2">{t("attendees.status")}</th>
                <th className="px-3 py-2">{t("attendees.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-stone-100">
                  <td className="px-3 py-2 font-medium text-stone-900">{r.customerName}</td>
                  <td className="px-3 py-2 text-stone-600">{r.customerEmail}</td>
                  <td className="px-3 py-2 text-stone-600">{r.ticketTypeName}</td>
                  <td className="px-3 py-2 text-stone-600">{r.quantity}</td>
                  <td className="px-3 py-2">
                    <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">{r.qrCode}</code>
                  </td>
                  <td className="px-3 py-2">
                    <Badge className={statusColors[r.bookingStatus] ?? ""}>{t(`bookingStatus.${r.bookingStatus}`)}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    {r.bookingStatus === "confirmed" && (
                      <Button variant="outline" size="sm">{t("attendees.checkIn")}</Button>
                    )}
                    {r.eTicketUrl && (
                      <Button variant="ghost" size="sm">{t("attendees.viewTicket")}</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">{t("attendees.exportCsv")}</Button>
          <Button variant="outline" size="sm">{t("attendees.sendBulkNotification")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
