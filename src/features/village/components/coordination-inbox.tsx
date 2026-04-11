"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COORDINATION_REQUESTS } from "../mock-data";
import type { CoordinationStatus } from "../types";

const STATUS_FILTERS = ["all", "under_review", "terms_agreed", "active", "completed"] as const;

export function CoordinationInbox() {
  const t = useTranslations("village");
  const [activeStatus, setActiveStatus] = useState<string>("all");

  const list =
    activeStatus === "all"
      ? COORDINATION_REQUESTS
      : COORDINATION_REQUESTS.filter((item) => item.status === activeStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("coordination.inbox")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`rounded-full px-3 py-1 text-xs ${activeStatus === status ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
            >
              {status === "all" ? t("coordination.all") : t(`coordination.statuses.${status as CoordinationStatus}`)}
            </button>
          ))}
        </div>
        {list.map((item) => (
          <div key={item.id} className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-sm font-semibold text-stone-900">{item.eventName}</p>
            <p className="text-xs text-stone-500">{item.organizerName}</p>
            <p className="text-xs text-stone-400">{t(`coordination.statuses.${item.status}`)}</p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/village-admin/coordination/${item.id}`}>{t("coordination.openDetail")}</Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
