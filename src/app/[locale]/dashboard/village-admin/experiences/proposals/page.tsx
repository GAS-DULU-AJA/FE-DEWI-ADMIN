"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
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

  const proposalRows = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        currentStatus: (statusOverride[item.id] ?? item.status) as ProposalStatus,
      })),
    [data, statusOverride],
  );

  const columns = useMemo<ColumnDef<(typeof proposalRows)[number]>[]>(
    () => [
      {
        id: "title",
        header: isId ? "Judul" : "Title",
        accessorKey: "title",
        sortable: true,
      },
      {
        id: "module",
        header: "Module",
        accessorKey: "module",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: "EXPERIENCE", value: "EXPERIENCE" },
          { label: "ACCOMMODATION", value: "ACCOMMODATION" },
          { label: "SME", value: "SME" },
        ],
        hideOnMobile: true,
      },
      {
        id: "fromRole",
        header: isId ? "Role Mitra" : "Partner Role",
        accessorKey: "fromRole",
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "submittedAt",
        header: isId ? "Masuk" : "Submitted",
        accessorKey: "submittedAt",
        sortable: true,
      },
      {
        id: "status",
        header: isId ? "Status" : "Status",
        accessorFn: (row) => row.currentStatus,
        sortable: true,
      },
    ],
    [isId, proposalRows],
  );

  const getActions = (row: (typeof proposalRows)[number]): ActionItem[] => [
    {
      label: isId ? "Pilih" : "Select",
      onClick: () => setSelectedId(row.id),
    },
  ];

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
            <DataTable
              data={proposalRows}
              columns={columns}
              keyExtractor={(row) => row.id}
              searchableFields={["title", "module", "fromRole", "targetVillage"]}
              searchPlaceholder={isId ? "Cari proposal..." : "Search proposals..."}
              pageSize={10}
              onRowClick={(row) => setSelectedId(row.id)}
              actions={getActions}
              mobileCardRenderer={(row) => (
                <div className="space-y-1">
                  <p className="font-medium text-on-surface">{row.title}</p>
                  <p className="text-xs text-on-surface/60">{row.module} · {row.fromRole}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface/60">{row.submittedAt}</span>
                    <Badge variant="secondary">{row.currentStatus}</Badge>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>

        {selected ? (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">{selected.title}</CardTitle>
                <Badge variant="secondary">{statusOverride[selected.id] ?? selected.status}</Badge>
              </div>
              <p className="text-xs text-on-surface/60">{selected.module} · {selected.fromRole} · {selected.targetVillage}</p>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-on-surface/80">
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
                  <div key={section.titleEn} className="rounded-xl border-0 p-4">
                    <p className="mb-2 font-semibold text-on-surface">{isId ? section.titleId : section.titleEn}</p>
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

              <div className="rounded-xl border-0 p-4">
                <p className="mb-2 font-semibold text-on-surface">{isId ? "Aksi Approval" : "Approval Action"}</p>
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
                    className="bg-primary hover:bg-primary"
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
    <div className="space-y-4 rounded-xl border-0 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {EXPERIENCE_PREVIEW_STEPS.map((step, idx) => (
          <button
            key={step}
            type="button"
            onClick={() => setStepIndex(idx)}
            className={`rounded-full px-3 py-1 text-xs ${
              idx === stepIndex ? "bg-primary text-white" : "bg-surface-container text-on-surface/70"
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
        <div className="space-y-1.5 text-sm text-on-surface/80">
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
        <div className="space-y-1.5 text-sm text-on-surface/80">
          <p><span className="font-medium">{isId ? "Mulai" : "Start"}:</span> {new Date(experience.scheduleStart).toLocaleString("id-ID")}</p>
          <p><span className="font-medium">{isId ? "Selesai" : "End"}:</span> {new Date(experience.scheduleEnd).toLocaleString("id-ID")}</p>
          <p><span className="font-medium">{isId ? "Multi-day" : "Multi-day"}:</span> {experience.isMultiDay ? "Yes" : "No"}</p>
          <p><span className="font-medium">{isId ? "Target Desa" : "Target Village"}:</span> {experience.targetVillage}</p>
        </div>
      ) : null}

      {stepIndex === 2 ? (
        <div className="space-y-1.5 text-sm text-on-surface/80">
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
        <div className="space-y-2 text-sm text-on-surface/80">
          {experience.ticketTypes.map((ticket) => (
            <div key={ticket.id} className="rounded-lg border-0 bg-surface-container-low p-3">
              <p className="font-medium text-on-surface">{ticket.name}</p>
              <p>{ticket.description}</p>
              <p>Rp {ticket.price.toLocaleString("id-ID")} · {isId ? "Kuota" : "Quota"}: {ticket.quota} · Sold: {ticket.sold}</p>
              <p>{isId ? "Benefit" : "Includes"}: {ticket.includes.join(", ")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {stepIndex === 4 ? (
        <div className="space-y-2 text-sm text-on-surface/80">
          {experience.itinerary.map((agenda, idx) => (
            <div key={`${agenda.time}-${idx}`} className="rounded-lg border-0 bg-surface-container-low p-3">
              <p className="font-medium text-on-surface">{agenda.time}{agenda.endTime ? ` - ${agenda.endTime}` : ""}</p>
              <p>{agenda.activity}</p>
              {agenda.location ? <p>{agenda.location}</p> : null}
              {agenda.description ? <p className="text-on-surface/70">{agenda.description}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {stepIndex === 5 ? (
        <div className="space-y-2 text-sm text-on-surface/80">
          {experience.speakers.length > 0 ? (
            experience.speakers.map((speaker) => (
              <div key={speaker.id} className="rounded-lg border-0 bg-surface-container-low p-3">
                <p className="font-medium text-on-surface">{speaker.name} · {speaker.title}</p>
                <p>{speaker.bio}</p>
                <p>{isId ? "Topik" : "Topics"}: {speaker.topics.join(", ")}</p>
              </div>
            ))
          ) : (
            <p className="text-on-surface/60">-</p>
          )}
        </div>
      ) : null}

      {stepIndex === 6 ? (
        <div className="space-y-3 text-sm text-on-surface/80">
          <div>
            <p className="mb-1 font-medium text-on-surface">{isId ? "Dokumen" : "Documents"}</p>
            {experience.documents.length > 0 ? (
              <ul className="space-y-1">
                {experience.documents.map((doc) => (
                  <li key={doc.id} className="rounded-lg border-0 bg-surface-container-low px-3 py-2">
                    {doc.name} · {doc.type} · {doc.url}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-on-surface/60">-</p>
            )}
          </div>

          <div>
            <p className="mb-1 font-medium text-on-surface">{isId ? "Media/Gambar" : "Media/Images"}</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {[experience.posterImage, ...experience.media].filter(Boolean).map((img, idx) => (
                <div key={`${img}-${idx}`} className="overflow-hidden rounded-lg border-0 bg-surface-container-low">
                  <img src={img} alt={`proposal-media-${idx}`} className="h-36 w-full object-cover" />
                </div>
              ))}
            </div>
            {experience.videoUrl ? <p className="mt-2">Video: {experience.videoUrl}</p> : null}
          </div>
        </div>
      ) : null}

      {stepIndex === 7 ? (
        <div className="space-y-2 text-sm text-on-surface/80">
          <p className="font-medium text-on-surface">{isId ? "Permintaan Fasilitas" : "Facility Requests"}</p>
          {coordination.facilityRequests.map((facility) => (
            <div key={`${facility.facilityId}-${facility.date}`} className="rounded-lg border-0 bg-surface-container-low p-3">
              <p>{facility.facilityName}</p>
              <p>{facility.date} · {facility.hours} {isId ? "jam" : "hours"} · Rp {facility.rentalPrice.toLocaleString("id-ID")}</p>
            </div>
          ))}
          <p className="mt-2"><span className="font-medium">{isId ? "Bagi Hasil" : "Revenue Sharing"}:</span> Organizer {coordination.revenueSplit.organizer}% · Desa {coordination.revenueSplit.village}% · Platform {coordination.revenueSplit.platform}%</p>
          <p className="font-medium text-on-surface">{isId ? "Jadwal Pembayaran" : "Payment Milestones"}</p>
          {coordination.paymentSchedule.map((payment) => (
            <div key={`${payment.milestone}-${payment.dueDate}`} className="rounded-lg border-0 bg-surface-container-low p-3">
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
