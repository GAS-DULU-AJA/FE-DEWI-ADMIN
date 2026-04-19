"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { ProposalStatusTracker } from "@/features/shared/proposals/components/proposal-status-tracker";
import { getVillageInboxProposals } from "@/features/shared/proposals/utils";
import type { ProposalStatus } from "@/features/shared/proposals/types";
import { getExperienceById, getExperienceCoordinations } from "@/features/experience/utils";
import type { ExperienceCoordination, ExperienceItem } from "@/features/experience/types";

export default function VillageExperienceProposalsPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const t = useTranslations("village");
  const proposals = getVillageInboxProposals();
  const [statusOverride, setStatusOverride] = useState<Record<string, string>>({});
  const [approvalNote, setApprovalNote] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string>(proposals[0]?.id ?? "");
  const [actionError, setActionError] = useState<Record<string, string>>({});
  const coordinations = useMemo(() => getExperienceCoordinations(), []);

  const data = useMemo(() => proposals, [proposals]);
  const selected = data.find((item) => item.id === selectedId) ?? data[0];
  const selectedExperiencePreview = useMemo(() => {
    if (!selected || selected.module !== "EXPERIENCE") return null;
    const coordinationId = selected.id.replace("exp-", "");
    const coordination = coordinations.find((item) => item.id === coordinationId);
    if (!coordination) return null;
    const experience = getExperienceById(coordination.experienceId);
    if (!experience) return null;
    return { coordination, experience };
  }, [coordinations, selected]);

  function updateStatus(id: string, next: ProposalStatus) {
    if (next === "rejected") {
      const reason = (approvalNote[id] ?? "").trim();
      if (!reason) {
        setActionError((prev) => ({
          ...prev,
          [id]: isId
            ? "Alasan penolakan wajib diisi sebelum reject."
            : "Rejection reason is required before rejecting.",
        }));
        return;
      }
    }
    setActionError((prev) => ({ ...prev, [id]: "" }));
    setStatusOverride((prev) => ({ ...prev, [id]: next }));
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={isId ? "Persetujuan Proposal Mitra" : "Partner Proposal Approvals"}
        description={
          isId
            ? "Pengelola Desa menerima daftar proposal lintas role (UMKM, Experience, Penginapan), memeriksa preview lengkap, lalu memutuskan approve/reject."
            : "Village managers receive cross-role proposals (SME, Experience, Accommodation), review complete previews, then approve or reject."
        }
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: isId ? "Persetujuan Proposal" : "Proposal Approvals" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isId ? "Daftar Proposal Masuk" : "Incoming Proposal List"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.map((item) => {
              const active = item.id === selected?.id;
              const finalStatus = (statusOverride[item.id] ?? item.status) as ProposalStatus;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    active ? "border-emerald-400 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-stone-900">{item.title}</p>
                    <Badge variant="secondary">{finalStatus}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{item.module} · {item.fromRole}</p>
                  <p className="text-xs text-stone-500">{isId ? "Masuk" : "Submitted"}: {item.submittedAt}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {selected ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{selected.title}</CardTitle>
                <Badge variant="secondary">{statusOverride[selected.id] ?? selected.status}</Badge>
              </div>
              <p className="text-xs text-stone-500">{selected.module} · {selected.fromRole} · {selected.targetVillage}</p>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-stone-700">
              <ProposalStatusTracker
                status={(statusOverride[selected.id] ?? selected.status) as ProposalStatus}
                timeline={selected.timeline}
                rejectionReason={selected.rejectionReason}
                isId={isId}
              />

              {selectedExperiencePreview ? (
                <ExperienceProposalPreviewWizard
                  isId={isId}
                  experience={selectedExperiencePreview.experience}
                  coordination={selectedExperiencePreview.coordination}
                />
              ) : (
                selected.sections.map((section) => (
                  <div key={section.titleEn} className="rounded-xl border border-stone-200 p-4">
                    <p className="mb-2 font-semibold text-stone-900">{isId ? section.titleId : section.titleEn}</p>
                    <div className="space-y-1.5">
                      {section.rows.map((row) => (
                        <p key={`${row.labelEn}-${row.value}`}>
                          <span className="font-medium">{isId ? row.labelId : row.labelEn}:</span> {row.value}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <div className="rounded-xl border border-stone-200 p-4">
                <p className="mb-2 font-semibold text-stone-900">{isId ? "Aksi Approval" : "Approval Action"}</p>
                <Textarea
                  value={approvalNote[selected.id] ?? ""}
                  onChange={(event) =>
                    setApprovalNote((prev) => ({ ...prev, [selected.id]: event.target.value }))
                  }
                  rows={3}
                  placeholder={
                    isId
                      ? "Tulis catatan approval / revisi / alasan reject"
                      : "Write approval note / revision request / rejection reason"
                  }
                />
                {actionError[selected.id] ? (
                  <p className="mt-2 text-xs font-medium text-rose-600">{actionError[selected.id]}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => updateStatus(selected.id, "approved")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isId ? "Approve" : "Approve"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateStatus(selected.id, "changes_requested")}
                  >
                    {isId ? "Minta Revisi" : "Request Revision"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => updateStatus(selected.id, "rejected")}
                  >
                    {isId ? "Reject" : "Reject"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

const EXPERIENCE_PREVIEW_STEPS = [
  "basic",
  "schedule",
  "operations",
  "tickets",
  "itinerary",
  "speakers",
  "documents",
  "facilities",
] as const;

function ExperienceProposalPreviewWizard({
  isId,
  experience,
  coordination,
}: {
  isId: boolean;
  experience: ExperienceItem;
  coordination: ExperienceCoordination;
}) {
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {EXPERIENCE_PREVIEW_STEPS.map((step, idx) => (
          <button
            key={step}
            type="button"
            onClick={() => setStepIndex(idx)}
            className={`rounded-full px-3 py-1 text-xs ${
              idx === stepIndex ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"
            }`}
          >
            {isId
              ? {
                  basic: "Info Dasar",
                  schedule: "Jadwal",
                  operations: "Operasional",
                  tickets: "Tiket",
                  itinerary: "Itinerary",
                  speakers: "Speakers",
                  documents: "Dokumen & Gambar",
                  facilities: "Fasilitas & Finansial",
                }[step]
              : {
                  basic: "Basic",
                  schedule: "Schedule",
                  operations: "Operations",
                  tickets: "Tickets",
                  itinerary: "Itinerary",
                  speakers: "Speakers",
                  documents: "Docs & Images",
                  facilities: "Facilities & Financial",
                }[step]}
          </button>
        ))}
      </div>

      {stepIndex === 0 ? (
        <div className="space-y-1.5 text-sm text-stone-700">
          <p><span className="font-medium">{isId ? "Nama" : "Name"}:</span> {experience.name}</p>
          <p><span className="font-medium">{isId ? "Kategori" : "Category"}:</span> {experience.category}</p>
          <p><span className="font-medium">{isId ? "Deskripsi" : "Description"}:</span> {experience.description}</p>
          <p><span className="font-medium">{isId ? "Visibilitas" : "Visibility"}:</span> {experience.visibility}</p>
          <p><span className="font-medium">{isId ? "Lokasi" : "Location"}:</span> {experience.locationName} ({experience.locationAddress})</p>
          <p><span className="font-medium">{isId ? "Tipe Lokasi" : "Location Type"}:</span> {experience.locationType}</p>
          {experience.onlineUrl ? <p><span className="font-medium">URL:</span> {experience.onlineUrl}</p> : null}
        </div>
      ) : null}

      {stepIndex === 1 ? (
        <div className="space-y-1.5 text-sm text-stone-700">
          <p><span className="font-medium">{isId ? "Mulai" : "Start"}:</span> {new Date(experience.scheduleStart).toLocaleString("id-ID")}</p>
          <p><span className="font-medium">{isId ? "Selesai" : "End"}:</span> {new Date(experience.scheduleEnd).toLocaleString("id-ID")}</p>
          <p><span className="font-medium">{isId ? "Multi-day" : "Multi-day"}:</span> {experience.isMultiDay ? "Yes" : "No"}</p>
          <p><span className="font-medium">{isId ? "Target Desa" : "Target Village"}:</span> {experience.targetVillage}</p>
        </div>
      ) : null}

      {stepIndex === 2 ? (
        <div className="space-y-1.5 text-sm text-stone-700">
          <p><span className="font-medium">{isId ? "Kapasitas" : "Capacity"}:</span> {experience.totalCapacity}</p>
          <p><span className="font-medium">PIC:</span> {experience.contactPerson}</p>
          <p><span className="font-medium">{isId ? "Telepon" : "Phone"}:</span> {experience.contactPhone}</p>
          <p><span className="font-medium">Email:</span> {experience.contactEmail}</p>
          <p><span className="font-medium">{isId ? "Kebijakan Batal" : "Cancellation Policy"}:</span> {experience.cancellationPolicy}</p>
          {experience.whatToBring ? <p><span className="font-medium">{isId ? "Persiapan Peserta" : "What To Bring"}:</span> {experience.whatToBring}</p> : null}
          {experience.languages?.length ? <p><span className="font-medium">{isId ? "Bahasa" : "Languages"}:</span> {experience.languages.join(", ")}</p> : null}
        </div>
      ) : null}

      {stepIndex === 3 ? (
        <div className="space-y-2 text-sm text-stone-700">
          {experience.ticketTypes.map((ticket) => (
            <div key={ticket.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="font-medium text-stone-900">{ticket.name}</p>
              <p>{ticket.description}</p>
              <p>Rp {ticket.price.toLocaleString("id-ID")} · {isId ? "Kuota" : "Quota"}: {ticket.quota} · Sold: {ticket.sold}</p>
              <p>{isId ? "Benefit" : "Includes"}: {ticket.includes.join(", ")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {stepIndex === 4 ? (
        <div className="space-y-2 text-sm text-stone-700">
          {experience.itinerary.map((agenda, idx) => (
            <div key={`${agenda.time}-${idx}`} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="font-medium text-stone-900">{agenda.time}{agenda.endTime ? ` - ${agenda.endTime}` : ""}</p>
              <p>{agenda.activity}</p>
              {agenda.location ? <p>{agenda.location}</p> : null}
              {agenda.description ? <p className="text-stone-600">{agenda.description}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {stepIndex === 5 ? (
        <div className="space-y-2 text-sm text-stone-700">
          {experience.speakers.length > 0 ? (
            experience.speakers.map((speaker) => (
              <div key={speaker.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                <p className="font-medium text-stone-900">{speaker.name} · {speaker.title}</p>
                <p>{speaker.bio}</p>
                <p>{isId ? "Topik" : "Topics"}: {speaker.topics.join(", ")}</p>
              </div>
            ))
          ) : (
            <p className="text-stone-500">-</p>
          )}
        </div>
      ) : null}

      {stepIndex === 6 ? (
        <div className="space-y-3 text-sm text-stone-700">
          <div>
            <p className="mb-1 font-medium text-stone-900">{isId ? "Dokumen" : "Documents"}</p>
            {experience.documents.length > 0 ? (
              <ul className="space-y-1">
                {experience.documents.map((doc) => (
                  <li key={doc.id} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
                    {doc.name} · {doc.type} · {doc.url}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-500">-</p>
            )}
          </div>

          <div>
            <p className="mb-1 font-medium text-stone-900">{isId ? "Media/Gambar" : "Media/Images"}</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {[experience.posterImage, ...experience.media].filter(Boolean).map((img, idx) => (
                <div key={`${img}-${idx}`} className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                  <img src={img} alt={`proposal-media-${idx}`} className="h-36 w-full object-cover" />
                </div>
              ))}
            </div>
            {experience.videoUrl ? <p className="mt-2">Video: {experience.videoUrl}</p> : null}
          </div>
        </div>
      ) : null}

      {stepIndex === 7 ? (
        <div className="space-y-2 text-sm text-stone-700">
          <p className="font-medium text-stone-900">{isId ? "Permintaan Fasilitas" : "Facility Requests"}</p>
          {coordination.facilityRequests.map((facility) => (
            <div key={`${facility.facilityId}-${facility.date}`} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p>{facility.facilityName}</p>
              <p>{facility.date} · {facility.hours} {isId ? "jam" : "hours"} · Rp {facility.rentalPrice.toLocaleString("id-ID")}</p>
            </div>
          ))}
          <p className="mt-2"><span className="font-medium">{isId ? "Bagi Hasil" : "Revenue Sharing"}:</span> Organizer {coordination.revenueSplit.organizer}% · Desa {coordination.revenueSplit.village}% · Platform {coordination.revenueSplit.platform}%</p>
          <p className="font-medium text-stone-900">{isId ? "Jadwal Pembayaran" : "Payment Milestones"}</p>
          {coordination.paymentSchedule.map((payment) => (
            <div key={`${payment.milestone}-${payment.dueDate}`} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p>{payment.milestone.toUpperCase()} · {payment.percent}% · Rp {payment.amount.toLocaleString("id-ID")}</p>
              <p>{isId ? "Jatuh tempo" : "Due"}: {payment.dueDate} · {payment.paid ? "Paid" : "Unpaid"}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
        >
          {isId ? "Sebelumnya" : "Previous"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={stepIndex === EXPERIENCE_PREVIEW_STEPS.length - 1}
          onClick={() => setStepIndex((prev) => Math.min(prev + 1, EXPERIENCE_PREVIEW_STEPS.length - 1))}
        >
          {isId ? "Berikutnya" : "Next"}
        </Button>
      </div>
    </div>
  );
}
