"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getExperiences } from "@/features/experience";
import { CalendarDays, Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { useLocale } from "next-intl";

const statusLabels: Record<string, { id: string; en: string }> = {
  draft: { id: "Draf", en: "Draft" },
  proposal_sent: { id: "Proposal Terkirim", en: "Proposal Sent" },
  under_review: { id: "Sedang Ditinjau", en: "Under Review" },
  changes_requested: { id: "Perlu Revisi", en: "Changes Requested" },
  village_approved: { id: "Disetujui", en: "Approved" },
  published: { id: "Dipublikasikan", en: "Published" },
  rejected: { id: "Ditolak", en: "Rejected" },
};

const statusColors: Record<string, "default" | "amber" | "blue" | "red" | "secondary"> = {
  draft: "secondary",
  proposal_sent: "blue",
  under_review: "amber",
  changes_requested: "amber",
  village_approved: "default",
  published: "default",
  rejected: "red",
};

export default function AccommodationProposalsPage() {
  const locale = useLocale();
  const isId = locale === "id";

  // Filter only proposals (non-published items that need approval)
  const experiences = getExperiences().filter(
    (e) => e.status !== "published" && e.status !== "completed" && e.status !== "closed"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          {isId ? "Status Proposal" : "Proposal Status"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {isId
            ? "Lacak status persetujuan experience yang Anda ajukan"
            : "Track the approval status of your submitted experiences"}
        </p>
      </div>

      {experiences.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title={isId ? "Belum ada proposal" : "No proposals yet"}
          description={
            isId
              ? "Buat experience baru untuk mengajukan proposal ke Pengelola Desa"
              : "Create a new experience to submit a proposal to the Village Admin"
          }
        />
      ) : (
        <div className="space-y-3">
          {experiences.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <Badge variant={statusColors[item.status] || "secondary"}>
                    {statusLabels[item.status]?.[isId ? "id" : "en"] || item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(item.scheduleStart).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {item.status === "village_approved" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : item.status === "rejected" ? (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    {statusLabels[item.status]?.[isId ? "id" : "en"] || item.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
