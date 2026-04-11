"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PARTNER_APPLICATIONS } from "../mock-data";

export function ApprovalPanel() {
  const t = useTranslations("village");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(PARTNER_APPLICATIONS[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PARTNER_APPLICATIONS.filter(
      (item) =>
        item.organizationName.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("approval.inbox")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("approval.searchPlaceholder")} />
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-lg border p-3 text-left ${selected?.id === item.id ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white"}`}
            >
              <p className="text-sm font-semibold text-stone-900">{item.organizationName}</p>
              <p className="text-xs text-stone-500">{item.ownerName}</p>
              <p className="text-xs text-stone-400">{t(`approval.statuses.${item.status}`)}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("approval.reviewPanel")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selected ? (
            <>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-stone-900">{selected.organizationName}</p>
                <p className="text-stone-500">{selected.ownerName}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-stone-200 p-3 text-sm">
                {Object.entries(selected.checklist).map(([key, done]) => (
                  <label key={key} className="flex items-center gap-2 text-stone-700">
                    <input type="checkbox" checked={done} readOnly />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
              <Textarea rows={4} placeholder={t("approval.feedbackPlaceholder")} defaultValue={selected.latestNote ?? ""} />
              <div className="flex gap-2">
                <Button>{t("actions.approve")}</Button>
                <Button variant="destructive">{t("actions.reject")}</Button>
                <Button variant="outline">{t("actions.requestRevision")}</Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500">{t("approval.noSelection")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
