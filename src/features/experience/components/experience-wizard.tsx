"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DIFFICULTY_LEVELS,
  EVENT_LOCATION_TYPES,
  EVENT_VISIBILITIES,
  EXPERIENCE_CATEGORIES,
  REFUND_POLICIES,
} from "@/features/experience/constants";
import { DocumentManager } from "@/features/experience/components/document-manager";
import {
  type FacilityCatalogItem,
  type FacilityReservationDraft,
  FacilityReservationSelector,
} from "@/features/experience/components/facility-reservation-selector";
import { ItineraryBuilder } from "@/features/experience/components/itinerary-builder";
import { NotificationManager } from "@/features/experience/components/notification-manager";
import { SpeakerSelector } from "@/features/experience/components/speaker-selector";
import { TicketManager } from "@/features/experience/components/ticket-manager";
import { EXPERIENCE_COORDINATIONS, SPEAKERS } from "@/features/experience/mock-data";
import type { ItineraryItem, TicketType } from "@/features/experience/types";
import { useLocale, useTranslations } from "next-intl";

const STEPS = [
  { id: "basic", labelId: "Informasi Dasar", labelEn: "Basic Info" },
  { id: "schedule", labelId: "Jadwal", labelEn: "Schedule" },
  { id: "facilities", labelId: "Fasilitas Desa", labelEn: "Village Facilities" },
  { id: "tickets", labelId: "Tiket", labelEn: "Tickets" },
  { id: "itinerary", labelId: "Itinerary", labelEn: "Itinerary" },
  { id: "proposal", labelId: "Proposal Detail", labelEn: "Proposal Details" },
  { id: "media", labelId: "Media", labelEn: "Media" },
  { id: "review", labelId: "Review", labelEn: "Review" },
] as const;

const VILLAGE_OPTIONS = ["Sari Alam", "Penglipuran", "Nglanggeran", "Pentingsari"];

const FACILITY_CATALOG: Record<string, FacilityCatalogItem[]> = {
  "Sari Alam": [
    { id: "fac-1", name: "Village Hall", availability: "limited", price: 1500000 },
    { id: "fac-2", name: "Parking Area", availability: "available", price: 500000 },
    { id: "fac-3", name: "East Courtyard", availability: "available", price: 750000 },
    { id: "fac-4", name: "Culinary Court", availability: "unavailable", price: 900000 },
  ],
  Penglipuran: [
    { id: "fac-5", name: "Balai Adat", availability: "available", price: 1800000 },
    { id: "fac-6", name: "Lapangan Tengah", availability: "limited", price: 1200000 },
    { id: "fac-7", name: "Area Parkir Utama", availability: "available", price: 600000 },
  ],
  Nglanggeran: [
    { id: "fac-8", name: "Amphitheater", availability: "available", price: 2200000 },
    { id: "fac-9", name: "Basecamp Trekking", availability: "limited", price: 850000 },
    { id: "fac-10", name: "Camping Ground", availability: "available", price: 1400000 },
  ],
  Pentingsari: [
    { id: "fac-11", name: "Pendopo Utama", availability: "limited", price: 1300000 },
    { id: "fac-12", name: "Area Workshop", availability: "available", price: 950000 },
    { id: "fac-13", name: "Taman Riverside", availability: "available", price: 700000 },
  ],
};

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

export function ExperienceWizard() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const isId = locale === "id";
  const [stepIndex, setStepIndex] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(EXPERIENCE_CATEGORIES[0]);
  const [visibility, setVisibility] = useState(EVENT_VISIBILITIES[0]);
  const [locationType, setLocationType] = useState(EVENT_LOCATION_TYPES[0]);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [targetVillage, setTargetVillage] = useState(VILLAGE_OPTIONS[0]);
  const [registrationType, setRegistrationType] = useState<"internal" | "external">("internal");
  const [difficultyLevel, setDifficultyLevel] = useState<(typeof DIFFICULTY_LEVELS)[number]>("easy");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [whatToBring, setWhatToBring] = useState("");
  const [languagesInput, setLanguagesInput] = useState("id, en");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [totalCapacity, setTotalCapacity] = useState(80);
  const [participantTargetStrategy, setParticipantTargetStrategy] = useState("");

  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [agendaSummary, setAgendaSummary] = useState("");
  const [operationsWindow, setOperationsWindow] = useState("");
  const [reservationCutoff, setReservationCutoff] = useState("");

  const [facilityRequests, setFacilityRequests] = useState<FacilityReservationDraft[]>([]);

  const [isPaidEvent, setIsPaidEvent] = useState(true);
  const [regularPrice, setRegularPrice] = useState(0);
  const [regularQuota, setRegularQuota] = useState(50);
  const [vipEnabled, setVipEnabled] = useState(false);
  const [vipPrice, setVipPrice] = useState(0);
  const [vipQuota, setVipQuota] = useState(20);
  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(true);
  const [earlyBirdPrice, setEarlyBirdPrice] = useState(0);
  const [earlyBirdQuota, setEarlyBirdQuota] = useState(30);
  const [salesStart, setSalesStart] = useState("");
  const [salesEnd, setSalesEnd] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [refundPolicy, setRefundPolicy] = useState<(typeof REFUND_POLICIES)[number]>("partial");

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionStart, setSessionStart] = useState("");
  const [sessionEnd, setSessionEnd] = useState("");
  const [sessionRoom, setSessionRoom] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionSpeakerId, setSessionSpeakerId] = useState("");
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [selectedSpeakerIds, setSelectedSpeakerIds] = useState<string[]>([]);

  const [primaryPic, setPrimaryPic] = useState("");
  const [operationsLead, setOperationsLead] = useState("");
  const [staffPlan, setStaffPlan] = useState("");
  const [participantCommunicationPlan, setParticipantCommunicationPlan] = useState("");

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [supportingImages, setSupportingImages] = useState<File[]>([]);
  const [readyForApproval, setReadyForApproval] = useState(false);

  const posterPreview = useMemo(() => (posterFile ? URL.createObjectURL(posterFile) : ""), [posterFile]);
  const bannerPreview = useMemo(() => (bannerFile ? URL.createObjectURL(bannerFile) : ""), [bannerFile]);

  const availableFacilities = FACILITY_CATALOG[targetVillage] ?? FACILITY_CATALOG[VILLAGE_OPTIONS[0]];
  const facilityReservations = useMemo(
    () =>
      EXPERIENCE_COORDINATIONS.flatMap((coordination) =>
        coordination.facilityRequests.map((item) => ({
          facilityId: item.facilityId,
          date: item.date,
          hours: item.hours,
        }))
      ),
    []
  );

  const draftTickets = useMemo<TicketType[]>(() => {
    if (!isPaidEvent) {
      return [
        {
          id: "draft-free",
          name: isId ? "Gratis" : "Free Pass",
          description: isId ? "Partisipasi tanpa tiket berbayar" : "Participation without paid ticket",
          price: 0,
          quota: regularQuota,
          sold: 0,
          perPersonPrice: true,
          includes: [isId ? "Akses event" : "Event access"],
          refundPolicy,
        },
      ];
    }

    const base: TicketType[] = [
      {
        id: "draft-regular",
        name: "Regular",
        description: isMultiDay
          ? isId
            ? "Full event pass untuk semua hari"
            : "Full event pass for all days"
          : isId
            ? "Tiket utama event"
            : "Primary event ticket",
        price: regularPrice,
        quota: regularQuota,
        sold: 0,
        perPersonPrice: true,
        includes: [isId ? "Akses event" : "Event access"],
        salesStart,
        salesEnd,
        refundPolicy,
      },
    ];

    if (vipEnabled) {
      base.push({
        id: "draft-vip",
        name: "VIP",
        description: isId ? "Akses prioritas dan benefit tambahan" : "Priority access and extra benefits",
        price: vipPrice,
        quota: vipQuota,
        sold: 0,
        perPersonPrice: true,
        includes: [isId ? "Fast lane" : "Fast lane", isId ? "Area prioritas" : "Priority area"],
        salesStart,
        salesEnd,
        refundPolicy,
      });
    }

    if (earlyBirdEnabled) {
      base.push({
        id: "draft-early-bird",
        name: "Early Bird",
        description: isId ? "Harga promosi sebelum periode reguler" : "Promotional pricing before regular sales",
        price: earlyBirdPrice,
        quota: earlyBirdQuota,
        sold: 0,
        perPersonPrice: true,
        includes: [isId ? "Harga promo" : "Promo price"],
        salesStart,
        salesEnd,
        refundPolicy,
      });
    }

    return base;
  }, [earlyBirdEnabled, earlyBirdPrice, earlyBirdQuota, isId, isMultiDay, isPaidEvent, refundPolicy, regularPrice, regularQuota, salesEnd, salesStart, vipEnabled, vipPrice, vipQuota]);

  const draftDocuments = useMemo(
    () => [
      {
        id: "draft-doc-1",
        experienceId: "draft",
        name: name ? `${name} - Rundown Proposal` : isId ? "Draft Rundown Proposal" : "Draft Proposal Rundown",
        type: "rundown" as const,
        url: "#",
        fileSize: 128000,
        uploadedAt: todayYmd(),
      },
      {
        id: "draft-doc-2",
        experienceId: "draft",
        name: targetVillage ? `${targetVillage} - Facility Request Notes` : "Facility Request Notes",
        type: "other" as const,
        url: "#",
        fileSize: 92000,
        uploadedAt: todayYmd(),
      },
    ],
    [name, targetVillage, isId]
  );

  const draftNotifications = useMemo(
    () => [
      {
        id: "draft-notif-1",
        experienceId: "draft",
        type: "reminder" as const,
        title: isId ? "Reminder peserta pra-event" : "Pre-event participant reminder",
        message:
          participantCommunicationPlan ||
          (isId ? "Reminder ke peserta mengenai jadwal, lokasi, dan kebutuhan hadir." : "Reminder for participants about schedule, location, and attendance requirements."),
        scheduledAt: scheduleStart || undefined,
        recipientCount: totalCapacity,
        status: "draft" as const,
      },
    ],
    [isId, participantCommunicationPlan, scheduleStart, totalCapacity]
  );

  const selectedSpeakers = useMemo(
    () => SPEAKERS.filter((speaker) => selectedSpeakerIds.includes(speaker.id)),
    [selectedSpeakerIds]
  );

  const summaryItems = [
    `${isId ? "Nama" : "Name"}: ${name || "-"}`,
    `${isId ? "Desa tujuan" : "Target village"}: ${targetVillage || "-"}`,
    `${isId ? "Kategori" : "Category"}: ${t(`categories.${category}`)}`,
    `${isId ? "Lokasi" : "Location"}: ${locationName || "-"}`,
    `${isId ? "Visibilitas" : "Visibility"}: ${t(`visibility.${visibility}`)}`,
    `${isId ? "Jadwal" : "Schedule"}: ${scheduleStart || "-"} ${scheduleEnd ? `-> ${scheduleEnd}` : ""}`,
    `${isId ? "Durasi" : "Duration"}: ${isMultiDay ? (isId ? "Multi-day" : "Multi-day") : (isId ? "Single-day" : "Single-day")}`,
    `${isId ? "Tiket draft" : "Draft tickets"}: ${draftTickets.length}`,
    `${isId ? "Pengisi acara" : "Speakers"}: ${selectedSpeakers.length}`,
    `${isId ? "Fasilitas desa" : "Village facilities"}: ${facilityRequests.length}`,
    `${isId ? "Sesi itinerary" : "Itinerary sessions"}: ${itineraryItems.length}`,
    `${isId ? "Dokumen proposal" : "Proposal documents"}: ${draftDocuments.length}`,
    `${isId ? "Draft notifikasi" : "Draft notifications"}: ${draftNotifications.length}`,
    `${isId ? "Poster" : "Poster"}: ${posterFile?.name || "-"}`,
    `${isId ? "Gambar pendukung" : "Supporting images"}: ${supportingImages.length}`,
  ];

  const formatBytes = (size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    if (size >= 1024) return `${Math.round(size / 1024)} KB`;
    return `${size} B`;
  };

  const addFacilityRequest = (facility: FacilityCatalogItem) => {
    setFacilityRequests((prev) => {
      if (prev.some((item) => item.facilityId === facility.id)) return prev;
      return [
        ...prev,
        {
          facilityId: facility.id,
          facilityName: facility.name,
          usageDate: scheduleStart ? scheduleStart.slice(0, 10) : todayYmd(),
          startTime: scheduleStart ? scheduleStart.slice(11, 16) : "08:00",
          endTime: scheduleEnd ? scheduleEnd.slice(11, 16) : "12:00",
          quantity: 1,
          notes: "",
        },
      ];
    });
  };

  const updateFacilityRequest = (facilityId: string, patch: Partial<FacilityReservationDraft>) => {
    setFacilityRequests((prev) => prev.map((item) => (item.facilityId === facilityId ? { ...item, ...patch } : item)));
  };

  const removeFacilityRequest = (facilityId: string) => {
    setFacilityRequests((prev) => prev.filter((item) => item.facilityId !== facilityId));
  };

  const handleVillageChange = (value: string) => {
    setTargetVillage(value);
    setFacilityRequests([]);
  };

  const handleAddSession = () => {
    if (!sessionTitle.trim() || !sessionStart) return;
    const newItem: ItineraryItem = {
      time: sessionStart,
      endTime: sessionEnd || undefined,
      activity: sessionTitle.trim(),
      location: sessionRoom.trim() || undefined,
      description: sessionDescription.trim() || undefined,
      isOptional: false,
      speakerId: sessionSpeakerId || undefined,
    };

    setItineraryItems((prev) => [...prev, newItem]);
    setSessionTitle("");
    setSessionStart("");
    setSessionEnd("");
    setSessionRoom("");
    setSessionDescription("");
    setSessionSpeakerId("");
  };

  const toggleSpeaker = (speakerId: string) => {
    setSelectedSpeakerIds((prev) =>
      prev.includes(speakerId) ? prev.filter((id) => id !== speakerId) : [...prev, speakerId]
    );
  };

  const completionItems = [
    { label: isId ? "Info dasar" : "Basic info", done: Boolean(name && targetVillage && contactPerson) },
    { label: isId ? "Jadwal" : "Schedule", done: Boolean(scheduleStart && scheduleEnd) },
    { label: isId ? "Fasilitas" : "Facilities", done: facilityRequests.length > 0 },
    { label: isId ? "Tiket" : "Tickets", done: draftTickets.length > 0 },
    { label: isId ? "Pengisi acara" : "Speakers", done: selectedSpeakers.length > 0 },
    { label: isId ? "Media" : "Media", done: Boolean(posterFile) },
  ];

  const completedCount = completionItems.filter((item) => item.done).length;
  const progressPct = Math.round((completedCount / completionItems.length) * 100);

  return (
    <Card className="overflow-hidden border-surface-container-high shadow-ambient">
      <CardHeader className="border-b border-surface-container-high bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(135deg,#f8fafc_0%,#ecfdf5_100%)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
              {isId ? "Proposal untuk approval desa" : "Village approval proposal"}
            </Badge>
            <div>
              <CardTitle className="text-xl text-on-surface">{t("components.wizardTitle")}</CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface/70">
                {isId
                  ? "Wizard dirancang ulang supaya lebih mudah dipakai, lebih jelas dibaca, dan seluruh kebutuhan proposal experience bisa disiapkan tanpa keluar dari flow utama."
                  : "The wizard has been redesigned to feel clearer, easier to use, and complete enough to prepare the full experience proposal in one main flow."}
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur xl:min-w-[320px]">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-on-surface/80">{isId ? "Progress proposal" : "Proposal progress"}</span>
              <span className="font-semibold text-on-surface">{progressPct}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {completionItems.map((item) => (
                <div key={item.label} className={`rounded-xl px-3 py-2 ${item.done ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface/60"}`}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, idx) => {
            const active = idx === stepIndex;
            const completed = idx < stepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-primary/300 bg-primary/10 shadow-ambient"
                    : completed
                      ? "border-surface-container-high bg-surface-container-lowest hover:border-surface-container-high"
                      : "border-surface-container-high bg-surface-container-low hover:border-surface-container-high"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${active ? "bg-primary text-white" : completed ? "bg-on-surface text-surface-container-lowest" : "bg-surface-container-high text-on-surface/80"}`}>
                    {idx + 1}
                  </span>
                  {completed ? (
                    <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
                      {isId ? "Selesai" : "Done"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 font-semibold text-on-surface">{isId ? step.labelId : step.labelEn}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-surface-container-high bg-surface-container-low p-4 text-sm text-on-surface/80">
          <p className="font-semibold text-on-surface">
            {isId ? "Rule parity" : "Parity rule"}
          </p>
          <p className="mt-1">
            {isId
              ? "Semua blok utama yang ada di View Experience harus sudah bisa disiapkan dari flow Add Experience ini."
              : "All major blocks shown in View Experience should be prepared from this Add Experience flow."}
          </p>
        </div>

        {stepIndex === 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("components.name")}</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={t("components.experienceNamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("components.category")}</Label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as (typeof EXPERIENCE_CATEGORIES)[number])}
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
              >
                {EXPERIENCE_CATEGORIES.map((item) => (
                  <option key={item} value={item}>{t(`categories.${item}`)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t("components.description")}</Label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Desa Wisata Tujuan" : "Target Tourism Village"}</Label>
              <select
                value={targetVillage}
                onChange={(event) => handleVillageChange(event.target.value)}
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
              >
                {VILLAGE_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Tipe Pengajuan" : "Submission Type"}</Label>
              <select
                value={registrationType}
                onChange={(event) => setRegistrationType(event.target.value as "internal" | "external")}
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
              >
                <option value="internal">{isId ? "Internal" : "Internal"}</option>
                <option value="external">{isId ? "External" : "External"}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Visibilitas Event" : "Event Visibility"}</Label>
              <select
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as (typeof EVENT_VISIBILITIES)[number])}
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
              >
                {EVENT_VISIBILITIES.map((item) => (
                  <option key={item} value={item}>{t(`visibility.${item}`)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Tipe Lokasi" : "Location Type"}</Label>
              <select
                value={locationType}
                onChange={(event) => setLocationType(event.target.value as (typeof EVENT_LOCATION_TYPES)[number])}
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
              >
                {EVENT_LOCATION_TYPES.map((item) => (
                  <option key={item} value={item}>{t(`locationType.${item}`)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Nama Lokasi / Venue" : "Venue / Location Name"}</Label>
              <Input value={locationName} onChange={(event) => setLocationName(event.target.value)} placeholder={isId ? "Contoh: Balai Desa" : "Example: Village Hall"} />
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Alamat Lokasi" : "Location Address"}</Label>
              <Input value={locationAddress} onChange={(event) => setLocationAddress(event.target.value)} placeholder={isId ? "Alamat lengkap lokasi" : "Full location address"} />
            </div>
            {(locationType === "online" || locationType === "hybrid") && (
              <div className="space-y-2 md:col-span-2">
                <Label>{isId ? "Link Event Online" : "Online Event URL"}</Label>
                <Input value={onlineUrl} onChange={(event) => setOnlineUrl(event.target.value)} placeholder="https://zoom.us/..." />
              </div>
            )}
            <div className="space-y-2">
              <Label>{isId ? "Difficulty Level" : "Difficulty Level"}</Label>
              <select
                value={difficultyLevel}
                onChange={(event) => setDifficultyLevel(event.target.value as (typeof DIFFICULTY_LEVELS)[number])}
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
              >
                {DIFFICULTY_LEVELS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Target / Kapasitas Peserta" : "Target / Capacity"}</Label>
              <Input type="number" min={1} value={totalCapacity} onChange={(event) => setTotalCapacity(Number(event.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>{isId ? "PIC Utama" : "Primary Contact Person"}</Label>
              <Input value={contactPerson} onChange={(event) => setContactPerson(event.target.value)} placeholder={isId ? "Nama PIC" : "Contact person name"} />
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Telepon PIC" : "Contact Phone"}</Label>
              <Input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="08xxxxxxxxxx" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Email PIC" : "Contact Email"}</Label>
              <Input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="organizer@example.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Bahasa Pendukung" : "Supported Languages"}</Label>
              <Input value={languagesInput} onChange={(event) => setLanguagesInput(event.target.value)} placeholder={isId ? "Contoh: id, en, ja" : "Example: id, en, ja"} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Apa yang Harus Dibawa Peserta" : "What Participants Should Bring"}</Label>
              <Textarea value={whatToBring} onChange={(event) => setWhatToBring(event.target.value)} rows={3} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Strategi Target Peserta / Attendee Strategy" : "Attendee Strategy"}</Label>
              <Textarea value={participantTargetStrategy} onChange={(event) => setParticipantTargetStrategy(event.target.value)} rows={3} />
            </div>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isId ? "Tanggal & Waktu Mulai" : "Start Date & Time"}</Label>
              <Input type="datetime-local" value={scheduleStart} onChange={(event) => setScheduleStart(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Tanggal & Waktu Selesai" : "End Date & Time"}</Label>
              <Input type="datetime-local" value={scheduleEnd} onChange={(event) => setScheduleEnd(event.target.value)} />
            </div>
            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-on-surface/80">
              <input type="checkbox" checked={isMultiDay} onChange={(event) => setIsMultiDay(event.target.checked)} />
              {isId ? "Event multi-hari" : "Multi-day event"}
            </label>
            <div className="space-y-2">
              <Label>{isId ? "Window Operasional / Check-in" : "Operations / Check-in Window"}</Label>
              <Input value={operationsWindow} onChange={(event) => setOperationsWindow(event.target.value)} placeholder={isId ? "Contoh: 07:00 - 08:00" : "Example: 07:00 - 08:00"} />
            </div>
            <div className="space-y-2">
              <Label>{isId ? "Cutoff Reservasi / Penjualan" : "Reservation / Sales Cutoff"}</Label>
              <Input value={reservationCutoff} onChange={(event) => setReservationCutoff(event.target.value)} placeholder={isId ? "Contoh: H-1 pukul 18:00" : "Example: D-1 at 18:00"} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Ringkasan Agenda / Rundown" : "Agenda Summary"}</Label>
              <Textarea value={agendaSummary} onChange={(event) => setAgendaSummary(event.target.value)} rows={4} placeholder={isId ? "Tuliskan alur sesi event" : "Describe the event session flow"} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Kebijakan Pembatalan" : "Cancellation Policy"}</Label>
              <Textarea value={cancellationPolicy} onChange={(event) => setCancellationPolicy(event.target.value)} rows={3} />
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <FacilityReservationSelector
            targetVillage={targetVillage}
            catalog={availableFacilities}
            reservations={facilityReservations}
            selectedRequests={facilityRequests}
            onAddFacility={addFacilityRequest}
            onRemoveFacility={removeFacilityRequest}
            onUpdateFacility={updateFacilityRequest}
          />
        )}

        {stepIndex === 3 && (
          <div className="space-y-4">
            <label className="inline-flex items-center gap-2 text-sm text-on-surface/80">
              <input type="checkbox" checked={isPaidEvent} onChange={(event) => setIsPaidEvent(event.target.checked)} />
              {isId ? "Event berbayar" : "Paid event"}
            </label>

            <div className="rounded-lg border border-surface-container-high p-3">
              <p className="mb-2 text-sm font-semibold text-on-surface">Regular</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{isId ? "Harga" : "Price"}</Label>
                  <Input type="number" min={0} value={regularPrice} onChange={(event) => setRegularPrice(Number(event.target.value))} disabled={!isPaidEvent} />
                </div>
                <div className="space-y-2">
                  <Label>{isId ? "Kuota" : "Quota"}</Label>
                  <Input type="number" min={1} value={regularQuota} onChange={(event) => setRegularQuota(Number(event.target.value))} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-surface-container-high p-3">
              <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-on-surface">
                <input type="checkbox" checked={vipEnabled} onChange={(event) => setVipEnabled(event.target.checked)} /> VIP
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{isId ? "Harga VIP" : "VIP Price"}</Label>
                  <Input type="number" min={0} value={vipPrice} onChange={(event) => setVipPrice(Number(event.target.value))} disabled={!vipEnabled || !isPaidEvent} />
                </div>
                <div className="space-y-2">
                  <Label>{isId ? "Kuota VIP" : "VIP Quota"}</Label>
                  <Input type="number" min={1} value={vipQuota} onChange={(event) => setVipQuota(Number(event.target.value))} disabled={!vipEnabled} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-surface-container-high p-3">
              <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-on-surface">
                <input type="checkbox" checked={earlyBirdEnabled} onChange={(event) => setEarlyBirdEnabled(event.target.checked)} /> Early Bird
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{isId ? "Harga Early Bird" : "Early Bird Price"}</Label>
                  <Input type="number" min={0} value={earlyBirdPrice} onChange={(event) => setEarlyBirdPrice(Number(event.target.value))} disabled={!earlyBirdEnabled || !isPaidEvent} />
                </div>
                <div className="space-y-2">
                  <Label>{isId ? "Kuota Early Bird" : "Early Bird Quota"}</Label>
                  <Input type="number" min={1} value={earlyBirdQuota} onChange={(event) => setEarlyBirdQuota(Number(event.target.value))} disabled={!earlyBirdEnabled} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{isId ? "Periode Penjualan Mulai" : "Ticket Sales Start"}</Label>
                <Input type="date" value={salesStart} onChange={(event) => setSalesStart(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Periode Penjualan Selesai" : "Ticket Sales End"}</Label>
                <Input type="date" value={salesEnd} onChange={(event) => setSalesEnd(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Kode Promo (opsional)" : "Promo Code (optional)"}</Label>
                <Input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder={t("components.promoCodeSample")} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Kebijakan Refund" : "Refund Policy"}</Label>
                <select
                  value={refundPolicy}
                  onChange={(event) => setRefundPolicy(event.target.value as (typeof REFUND_POLICIES)[number])}
                  className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
                >
                  {REFUND_POLICIES.map((policy) => (
                    <option key={policy} value={policy}>{policy}</option>
                  ))}
                </select>
              </div>
            </div>

            <TicketManager tickets={draftTickets} />
          </div>
        )}

        {stepIndex === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-on-surface/70">
              {isId
                ? "Lengkapi minimal satu sesi agenda untuk memudahkan tim operasional dan pengelola desa memeriksa alur acara."
                : "Add at least one agenda session so operations and village managers can review the event flow."}
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>{isId ? "Judul Sesi" : "Session Title"}</Label>
                <Input value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} placeholder={isId ? "Contoh: Workshop Batik" : "Example: Batik Workshop"} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Jam Mulai" : "Start Time"}</Label>
                <Input type="time" value={sessionStart} onChange={(event) => setSessionStart(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Jam Selesai" : "End Time"}</Label>
                <Input type="time" value={sessionEnd} onChange={(event) => setSessionEnd(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Lokasi / Ruang" : "Location / Room"}</Label>
                <Input value={sessionRoom} onChange={(event) => setSessionRoom(event.target.value)} placeholder={isId ? "Contoh: Aula Timur" : "Example: East Hall"} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Pengisi Acara Sesi" : "Session Speaker"}</Label>
                <select
                  value={sessionSpeakerId}
                  onChange={(event) => setSessionSpeakerId(event.target.value)}
                  className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
                  disabled={selectedSpeakers.length === 0}
                >
                  <option value="">{isId ? "Tanpa pengisi acara khusus" : "No specific speaker"}</option>
                  {selectedSpeakers.map((speaker) => (
                    <option key={speaker.id} value={speaker.id}>
                      {speaker.name} - {speaker.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{isId ? "Deskripsi Sesi" : "Session Description"}</Label>
                <Textarea value={sessionDescription} onChange={(event) => setSessionDescription(event.target.value)} rows={3} />
              </div>
            </div>
            {selectedSpeakers.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                {isId
                  ? "Pilih pengisi acara di step Proposal Detail terlebih dahulu jika sesi perlu dikaitkan ke speaker tertentu."
                  : "Select speakers in the Proposal Details step first if a session needs to be linked to a specific speaker."}
              </div>
            ) : null}
            <div className="flex justify-end">
              <Button type="button" onClick={handleAddSession}>{isId ? "Tambah Sesi" : "Add Session"}</Button>
            </div>
            {itineraryItems.length > 0 ? <ItineraryBuilder items={itineraryItems} speakers={selectedSpeakers} /> : null}
          </div>
        )}

        {stepIndex === 5 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{isId ? "PIC Operasional Utama" : "Primary Operations PIC"}</Label>
                <Input value={primaryPic} onChange={(event) => setPrimaryPic(event.target.value)} placeholder={isId ? "Nama PIC utama" : "Primary PIC name"} />
              </div>
              <div className="space-y-2">
                <Label>{isId ? "Koordinator Lapangan" : "Field Operations Lead"}</Label>
                <Input value={operationsLead} onChange={(event) => setOperationsLead(event.target.value)} placeholder={isId ? "Nama koordinator lapangan" : "Field operations lead"} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{isId ? "Rencana Tim Pelaksana" : "Staffing Plan"}</Label>
                <Textarea value={staffPlan} onChange={(event) => setStaffPlan(event.target.value)} rows={3} placeholder={isId ? "Jelaskan kebutuhan pelaksana, shift, dan pembagian tugas." : "Describe staffing needs, shift plan, and responsibilities."} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{isId ? "Rencana Komunikasi Peserta" : "Participant Communication Plan"}</Label>
                <Textarea value={participantCommunicationPlan} onChange={(event) => setParticipantCommunicationPlan(event.target.value)} rows={3} />
              </div>
            </div>

            <SpeakerSelector
              speakers={SPEAKERS}
              selectedSpeakerIds={selectedSpeakerIds}
              onToggleSpeaker={toggleSpeaker}
            />

            {selectedSpeakers.length > 0 ? (
              <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-ambient">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-on-surface">
                      {isId ? "Line-up pengisi acara" : "Selected line-up"}
                    </p>
                    <p className="text-sm text-on-surface/60">
                      {isId
                        ? "Pengisi acara ini akan muncul sebagai bagian proposal ke pengelola desa."
                        : "These speakers will be shown as part of the proposal for village manager review."}
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    {selectedSpeakers.length} {isId ? "speaker" : "speakers"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {selectedSpeakers.map((speaker) => (
                    <div key={speaker.id} className="rounded-2xl border border-surface-container-high bg-surface-container-low p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {speaker.name
                            .split(" ")
                            .map((chunk) => chunk[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{speaker.name}</p>
                          <p className="text-sm text-on-surface/60">{speaker.title}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {speaker.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="rounded-full text-[11px] text-on-surface/70">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <DocumentManager documents={draftDocuments} />
              <NotificationManager notifications={draftNotifications} />
            </div>
          </div>
        )}

        {stepIndex === 6 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4">
                <Label>{isId ? "Upload Poster Event" : "Upload Event Poster"}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setPosterFile(event.target.files?.[0] ?? null)}
                />
                {posterFile ? (
                  <div className="text-xs text-on-surface/70">
                    <p className="font-medium text-on-surface">{posterFile.name}</p>
                    <p>{formatBytes(posterFile.size)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface/60">{t("components.posterPlaceholder")}</p>
                )}
                {posterPreview ? <img src={posterPreview} alt="Poster preview" className="h-28 w-full rounded-md border border-surface-container-high object-cover" /> : null}
              </div>

              <div className="space-y-2 rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4">
                <Label>{isId ? "Upload Banner Pendukung" : "Upload Supporting Banner"}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)}
                />
                {bannerFile ? (
                  <div className="text-xs text-on-surface/70">
                    <p className="font-medium text-on-surface">{bannerFile.name}</p>
                    <p>{formatBytes(bannerFile.size)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface/60">{t("components.bannerPlaceholder")}</p>
                )}
                {bannerPreview ? <img src={bannerPreview} alt="Banner preview" className="h-28 w-full rounded-md border border-surface-container-high object-cover" /> : null}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-dashed border-surface-container-high bg-surface-container-low p-4">
              <Label>{isId ? "Upload Gambar Pendukung (maks. 10)" : "Upload Supporting Images (max 10)"}</Label>
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []).slice(0, 10);
                  setSupportingImages(files);
                }}
              />
              {supportingImages.length > 0 ? (
                <ul className="space-y-1 text-xs text-on-surface/80">
                  {supportingImages.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between rounded-md bg-surface-container-lowest px-2 py-1">
                      <span className="truncate">{file.name}</span>
                      <span className="text-on-surface/60">{formatBytes(file.size)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-on-surface/60">{isId ? "Belum ada gambar pendukung dipilih." : "No supporting images selected yet."}</p>
              )}
            </div>
          </div>
        )}

        {stepIndex === 7 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-on-surface">{isId ? "Review Proposal Experience" : "Review Experience Proposal"}</p>
            <ul className="space-y-2 rounded-lg border border-surface-container-high bg-surface-container-low p-4 text-sm text-on-surface/80">
              {summaryItems.map((item) => (
                <li key={item} className="border-b border-surface-container-high pb-1 last:border-b-0 last:pb-0">{item}</li>
              ))}
            </ul>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">{isId ? "Checklist approval" : "Approval checklist"}</p>
              <ul className="mt-2 space-y-1 text-amber-800">
                <li>{isId ? `Fasilitas desa terpilih: ${facilityRequests.length}` : `Selected village facilities: ${facilityRequests.length}`}</li>
                <li>{isId ? `Draft tiket tersedia: ${draftTickets.length}` : `Draft tickets prepared: ${draftTickets.length}`}</li>
                <li>{isId ? `Itinerary siap review: ${itineraryItems.length}` : `Itinerary ready for review: ${itineraryItems.length}`}</li>
              </ul>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-on-surface/80">
              <input type="checkbox" checked={readyForApproval} onChange={(event) => setReadyForApproval(event.target.checked)} />
              {isId
                ? "Saya memastikan proposal experience lengkap dan siap diajukan untuk approval Pengelola Desa."
                : "I confirm the experience proposal is complete and ready for village manager approval."}
            </label>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex((v) => Math.max(0, v - 1))}>{t("components.previous")}</Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button onClick={() => setStepIndex((v) => Math.min(STEPS.length - 1, v + 1))}>{t("components.next")}</Button>
          ) : (
            <Button disabled={!readyForApproval}>{t("components.submitProposal")}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
