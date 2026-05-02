"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { VILLAGE_PROFILE, VILLAGE_CONTACTS, VILLAGE_SOCIAL_MEDIA, VILLAGE_PROFILE_SECTIONS, AVAILABLE_TAGS, VILLAGE_TAG_ASSIGNMENTS } from "../mock-data";
import { OperatingHoursEditor } from "./operating-hours-editor";
import { ContactListEditor } from "./contact-list-editor";
import { SocialMediaListEditor } from "./social-media-list-editor";
import { ProfileSectionEditor } from "./profile-section-editor";
import { TagSelector } from "./tag-selector";
import type {
  GovernmentServiceFacility,
  GovernmentServicePriority,
  OperatingHoursSchedule,
  VillageProfile,
  VillageContact,
  VillageSocialMedia,
  ProfileSection,
  VillageTagAssignment,
  VillageHighlightedAttraction,
  VillageBookingInfo,
} from "../types";
const VillageLocationPicker = dynamic(() => import("./village-location-picker").then(m => m.VillageLocationPicker), { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse rounded-lg" /> });

type Tab = "profile" | "location" | "media" | "highlights";

const GOVERNMENT_SERVICE_OPTIONS = [
  "clinic",
  "hospital",
  "fire_department",
  "police",
  "pharmacy",
  "other",
] as const;

const GOVERNMENT_SERVICE_PRIORITY_OPTIONS = ["open_24h", "emergency_ready"] as const;
const REQUIRED_EMERGENCY_TYPES = new Set(["clinic", "hospital", "police"]);
const AUTO_EMERGENCY_TYPES = new Set(["clinic", "hospital", "police", "fire_department"]);

function getYouTubeEmbedUrl(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function ImagePreview({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function parseCoordinateInput(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isOpen24Hours(value: string): boolean {
  const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();
  return /24\s*jam|24\s*hours?|24\/7/.test(normalized);
}

function hasEmergencyKeyword(value: string): boolean {
  const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();
  return /(darurat|emergency|igd|ugd|ambulans|ambulance|rescue|siaga)/.test(normalized);
}

export function VillageDataForm() {
  const t = useTranslations("village");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [form, setForm] = useState<VillageProfile>(VILLAGE_PROFILE);
  const [contacts, setContacts] = useState<VillageContact[]>(VILLAGE_CONTACTS);
  const [socialMedia, setSocialMedia] = useState<VillageSocialMedia[]>(VILLAGE_SOCIAL_MEDIA);
  const [profileSections, setProfileSections] = useState<ProfileSection[]>(VILLAGE_PROFILE_SECTIONS);
  const [tagAssignments, setTagAssignments] = useState<VillageTagAssignment[]>(VILLAGE_TAG_ASSIGNMENTS);
  const [savedTab, setSavedTab] = useState<Tab | null>(null);
  const [locationValidationError, setLocationValidationError] = useState("");
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [highlights, setHighlights] = useState<VillageHighlightedAttraction[]>(VILLAGE_PROFILE.highlightedAttractions ?? []);
  const [bookingInfo, setBookingInfo] = useState<VillageBookingInfo>(VILLAGE_PROFILE.bookingInfo ?? { duration: "", groupSize: "", includes: [], startingPrice: undefined });

  function toggleServiceExpanded(id: string) {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave(tab: Tab) {
    if (tab === "location") {
      const hasEmergencyService = (form.governmentServices ?? []).some((service) => {
        if (!REQUIRED_EMERGENCY_TYPES.has(service.type)) return false;
        return service.name.trim().length > 0 && service.address.trim().length > 0;
      });

      if (!hasEmergencyService) {
        setLocationValidationError(t("villageData.governmentServices.requiredEmergencyError"));
        return;
      }

      setLocationValidationError("");
    }

    setSavedTab(tab);
    setTimeout(() => setSavedTab(null), 2000);
  }

  function updateGallery(index: number, value: string) {
    const gallery = [...(form.gallery ?? [])];
    gallery[index] = value;
    setForm({ ...form, gallery });
  }

  function removeGalleryItem(index: number) {
    setForm({ ...form, gallery: (form.gallery ?? []).filter((_, i) => i !== index) });
  }

  function addGalleryItem() {
    setForm({ ...form, gallery: [...(form.gallery ?? []), ""] });
  }

  function addGovernmentService() {
    const services = [...(form.governmentServices ?? [])];
    const newId = crypto.randomUUID();
    services.push({
      id: newId,
      type: "clinic",
      name: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      phone: "",
      operatingHours: "",
      notes: "",
      priorities: [],
    });
    setLocationValidationError("");
    setExpandedServices((prev) => new Set(prev).add(newId));
    setForm({ ...form, governmentServices: services });
  }

  function updateGovernmentService<K extends keyof GovernmentServiceFacility>(
    id: string,
    key: K,
    value: GovernmentServiceFacility[K],
  ) {
    const services = (form.governmentServices ?? []).map((item) => {
      if (item.id !== id) return item;

      const updated = { ...item, [key]: value };

      if (key === "operatingHours") {
        const priorities = updated.priorities ?? [];
        let is24h = false;

        if (typeof value === "string") {
          is24h = isOpen24Hours(value);
        } else if (typeof value === "object" && value !== null) {
          const schedule = value as OperatingHoursSchedule;
          const enabledDays = Object.values(schedule).filter((d) => d.enabled);
          is24h = enabledDays.length > 0 && enabledDays.every((d) => d.is24Hours);
        }

        if (is24h) {
          if (!priorities.includes("open_24h")) {
            updated.priorities = [...priorities, "open_24h"];
          }
        } else {
          updated.priorities = priorities.filter((candidate) => candidate !== "open_24h");
        }
      }

      if (key === "type" || key === "notes") {
        const priorities = updated.priorities ?? [];
        const shouldSetEmergencyReady =
          AUTO_EMERGENCY_TYPES.has(updated.type) && hasEmergencyKeyword(updated.notes ?? "");

        if (shouldSetEmergencyReady) {
          if (!priorities.includes("emergency_ready")) {
            updated.priorities = [...priorities, "emergency_ready"];
          }
        } else {
          updated.priorities = priorities.filter((candidate) => candidate !== "emergency_ready");
        }
      }

      return updated;
    });
    setLocationValidationError("");
    setForm({ ...form, governmentServices: services });
  }

  function toggleServicePriority(id: string, priority: GovernmentServicePriority) {
    const services = (form.governmentServices ?? []).map((item) => {
      if (item.id !== id) return item;
      const existing = item.priorities ?? [];
      const next = existing.includes(priority)
        ? existing.filter((candidate) => candidate !== priority)
        : [...existing, priority];
      return { ...item, priorities: next };
    });
    setLocationValidationError("");
    setForm({ ...form, governmentServices: services });
  }

  function removeGovernmentService(id: string) {
    setForm({
      ...form,
      governmentServices: (form.governmentServices ?? []).filter((item) => item.id !== id),
    });
    setLocationValidationError("");
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: t("villageData.tabs.profile") },
    { key: "location", label: t("villageData.tabs.locationContact") },
    { key: "media", label: t("villageData.tabs.media") },
    { key: "highlights", label: t("villageData.tabs.highlights") },
  ];

  const embedUrl = form.videoUrl ? getYouTubeEmbedUrl(form.videoUrl) : null;
  const filledGallery = (form.gallery ?? []).filter((u) => u.trim());

  return (
    <div className="max-w-3xl space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-surface-container-high bg-muted/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-background shadow-ambient text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Profile ─────────────────────────────────── */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("villageData.profileTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>{t("villageData.villageName")}</Label>
                <Input
                  value={form.villageName}
                  onChange={(e) => setForm({ ...form, villageName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("villageData.description")}</Label>
                <Textarea
                  rows={3}
                  placeholder={t("villageData.descriptionPlaceholder")}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("villageData.history")}</Label>
                <Textarea
                  rows={5}
                  placeholder={t("villageData.historyPlaceholder")}
                  value={form.history}
                  onChange={(e) => setForm({ ...form, history: e.target.value })}
                />
              </div>

              <div className="border-t pt-5">
                <ProfileSectionEditor sections={profileSections} onChange={setProfileSections} />
              </div>

              <div className="border-t pt-5">
                <TagSelector
                  availableTags={AVAILABLE_TAGS}
                  assignments={tagAssignments}
                  onAssign={(tagId) => {
                    const tag = AVAILABLE_TAGS.find((t) => t.id === tagId);
                    if (!tag) return;
                    setTagAssignments([
                      ...tagAssignments,
                      {
                        id: `vta-${Date.now()}`,
                        tagId,
                        tag,
                        assignedAt: new Date().toISOString(),
                      },
                    ]);
                  }}
                  onRemove={(tagId) => setTagAssignments(tagAssignments.filter((a) => a.tagId !== tagId))}
                />
              </div>

              {/* Curation flags */}
              <div className="border-t pt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={form.isFeatured ?? false}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <div>
                    <Label htmlFor="isFeatured">{t("villageData.isFeatured")}</Label>
                    <p className="text-xs text-muted-foreground">{t("villageData.isFeaturedHint")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={form.isPopular ?? false}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <div>
                    <Label htmlFor="isPopular">{t("villageData.isPopular")}</Label>
                    <p className="text-xs text-muted-foreground">{t("villageData.isPopularHint")}</p>
                  </div>
                </div>
              </div>

              {/* Booking Package Info */}
              <div className="border-t pt-5 space-y-4">
                <p className="text-sm font-semibold">{t("villageData.bookingInfo.title")}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("villageData.bookingInfo.duration")}</Label>
                    <Input
                      placeholder={t("villageData.bookingInfo.durationPlaceholder")}
                      value={bookingInfo.duration}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, duration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("villageData.bookingInfo.groupSize")}</Label>
                    <Input
                      placeholder={t("villageData.bookingInfo.groupSizePlaceholder")}
                      value={bookingInfo.groupSize}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, groupSize: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("villageData.bookingInfo.startingPrice")}</Label>
                    <Input
                      type="number"
                      value={bookingInfo.startingPrice ?? ""}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, startingPrice: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("villageData.bookingInfo.includes")}</Label>
                    <button
                      type="button"
                      onClick={() => setBookingInfo({ ...bookingInfo, includes: [...bookingInfo.includes, ""] })}
                      className="text-xs text-primary hover:underline"
                    >
                      {t("villageData.bookingInfo.addInclude")}
                    </button>
                  </div>
                  {bookingInfo.includes.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        placeholder={t("villageData.bookingInfo.includesPlaceholder")}
                        value={item}
                        onChange={(e) => {
                          const next = [...bookingInfo.includes];
                          next[i] = e.target.value;
                          setBookingInfo({ ...bookingInfo, includes: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setBookingInfo({ ...bookingInfo, includes: bookingInfo.includes.filter((_, idx) => idx !== i) })}
                        className="text-xs text-destructive hover:underline shrink-0"
                      >
                        {t("villageData.bookingInfo.removeInclude")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("profile")}>
                  {savedTab === "profile" ? `✓ ${t("villageData.saved")}` : t("actions.saveProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Location & Contact ───────────────────────── */}
        {activeTab === "location" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("villageData.tabs.locationContact")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Accordion type="single" defaultValue={["location-core"]} className="rounded-xl border border-surface-container-high/60 bg-surface-container-low/40 px-4">
                <AccordionItem value="location-core">
                  <AccordionTrigger value="location-core" className="text-sm font-semibold">
                    {t("villageData.tabs.locationContact")}
                  </AccordionTrigger>
                  <AccordionContent value="location-core" className="space-y-5">
                    <div className="space-y-2">
                      <Label>{t("villageData.address")}</Label>
                      <Input
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("villageData.latitude")}</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={form.latitude}
                          onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("villageData.longitude")}</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={form.longitude}
                          onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("villageData.coordinatesHint")}</p>
                    <VillageLocationPicker
                      latitude={form.latitude}
                      longitude={form.longitude}
                      onLocationChange={(latitude, longitude) => setForm({ ...form, latitude, longitude })}
                      serviceMarkers={(form.governmentServices ?? [])
                        .filter(
                          (service) =>
                            Number.isFinite(service.latitude) &&
                            Number.isFinite(service.longitude),
                        )
                        .map((service) => ({
                          id: service.id,
                          name: service.name || t("villageData.governmentServices.unnamed"),
                          typeLabel: t(`villageData.governmentServices.types.${service.type}`),
                          latitude: service.latitude as number,
                          longitude: service.longitude as number,
                          priorityLabels: (service.priorities ?? []).map((priority) =>
                            t(`villageData.governmentServices.priorities.${priority}`),
                          ),
                        }))}
                    />

                    <div className="border-t border-border/50 pt-5">
                      <ContactListEditor contacts={contacts} onChange={setContacts} />
                    </div>

                    <div className="border-t border-border/50 pt-5">
                      <SocialMediaListEditor items={socialMedia} onChange={setSocialMedia} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location-government-services">
                  <AccordionTrigger value="location-government-services" className="text-sm font-semibold">
                    {t("villageData.governmentServices.title")}
                  </AccordionTrigger>
                  <AccordionContent value="location-government-services" className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{t("villageData.governmentServices.title")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("villageData.governmentServices.description")}
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={addGovernmentService}>
                        + {t("villageData.governmentServices.add")}
                      </Button>
                    </div>

                    {(form.governmentServices ?? []).length === 0 ? (
                      <div className="rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
                        {t("villageData.governmentServices.empty")}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(form.governmentServices ?? []).map((service, index) => {
                          const isExpanded = expandedServices.has(service.id);
                          const serviceLabel = service.name
                            ? `${t(`villageData.governmentServices.types.${service.type}`)} — ${service.name}`
                            : `${t("villageData.governmentServices.itemLabel", { number: index + 1 })} · ${t(`villageData.governmentServices.types.${service.type}`)}`;

                          return (
                          <div key={service.id} className="rounded-xl border bg-muted/20 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleServiceExpanded(service.id)}
                              className="flex w-full items-center justify-between gap-3 p-3 text-left hover:bg-muted/40 transition-colors"
                            >
                              <p className="text-sm font-medium truncate">{serviceLabel}</p>
                              <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                            </button>

                            {isExpanded && (
                            <div className="border-t px-3 pb-3 pt-3 space-y-3">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeGovernmentService(service.id)}
                                className="text-xs text-destructive hover:underline"
                              >
                                {t("villageData.governmentServices.remove")}
                              </button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>{t("villageData.governmentServices.type")}</Label>
                                <select
                                  value={service.type}
                                  onChange={(e) =>
                                    updateGovernmentService(
                                      service.id,
                                      "type",
                                      e.target.value as GovernmentServiceFacility["type"],
                                    )
                                  }
                                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                >
                                  {GOVERNMENT_SERVICE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                      {t(`villageData.governmentServices.types.${option}`)}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-2">
                                <Label>{t("villageData.governmentServices.name")}</Label>
                                <Input
                                  value={service.name}
                                  onChange={(e) => updateGovernmentService(service.id, "name", e.target.value)}
                                  placeholder={t("villageData.governmentServices.namePlaceholder")}
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label>{t("villageData.governmentServices.address")}</Label>
                                <Input
                                  value={service.address}
                                  onChange={(e) => updateGovernmentService(service.id, "address", e.target.value)}
                                  placeholder={t("villageData.governmentServices.addressPlaceholder")}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>{t("villageData.governmentServices.latitude")}</Label>
                                <Input
                                  type="number"
                                  step="0.000001"
                                  value={service.latitude ?? ""}
                                  onChange={(e) =>
                                    updateGovernmentService(
                                      service.id,
                                      "latitude",
                                      parseCoordinateInput(e.target.value),
                                    )
                                  }
                                  placeholder={t("villageData.governmentServices.latitudePlaceholder")}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>{t("villageData.governmentServices.longitude")}</Label>
                                <Input
                                  type="number"
                                  step="0.000001"
                                  value={service.longitude ?? ""}
                                  onChange={(e) =>
                                    updateGovernmentService(
                                      service.id,
                                      "longitude",
                                      parseCoordinateInput(e.target.value),
                                    )
                                  }
                                  placeholder={t("villageData.governmentServices.longitudePlaceholder")}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>{t("villageData.governmentServices.phone")}</Label>
                                <Input
                                  value={service.phone ?? ""}
                                  onChange={(e) => updateGovernmentService(service.id, "phone", e.target.value)}
                                  placeholder={t("villageData.governmentServices.phonePlaceholder")}
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label>{t("villageData.governmentServices.operatingHours")}</Label>
                                <OperatingHoursEditor
                                  value={service.operatingHours}
                                  onChange={(schedule: OperatingHoursSchedule) =>
                                    updateGovernmentService(service.id, "operatingHours", schedule)
                                  }
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label>{t("villageData.governmentServices.priorityBadges")}</Label>
                                <div className="flex flex-wrap gap-2">
                                  {GOVERNMENT_SERVICE_PRIORITY_OPTIONS.map((priority) => {
                                    const isActive = (service.priorities ?? []).includes(priority);
                                    return (
                                      <button
                                        key={priority}
                                        type="button"
                                        onClick={() => toggleServicePriority(service.id, priority)}
                                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                          isActive
                                            ? "border-primary/500 bg-primary/10 text-primary"
                                            : "border-border bg-background text-muted-foreground hover:text-foreground"
                                        }`}
                                      >
                                        {t(`villageData.governmentServices.priorities.${priority}`)}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <Label>{t("villageData.governmentServices.notes")}</Label>
                                <Textarea
                                  rows={2}
                                  value={service.notes ?? ""}
                                  onChange={(e) => updateGovernmentService(service.id, "notes", e.target.value)}
                                  placeholder={t("villageData.governmentServices.notesPlaceholder")}
                                />
                              </div>
                            </div>
                            </div>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {locationValidationError ? (
                <p className="text-sm text-destructive">{locationValidationError}</p>
              ) : null}

              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("location")}>
                  {savedTab === "location" ? `✓ ${t("villageData.saved")}` : t("actions.saveProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Highlights ──────────────────────────────── */}
        {activeTab === "highlights" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("villageData.highlights.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setHighlights([
                      ...highlights,
                      { id: crypto.randomUUID(), title: "", description: "", image: "", tag: "" },
                    ])
                  }
                >
                  {t("villageData.highlights.add")}
                </Button>
              </div>

              {highlights.length === 0 ? (
                <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                  {t("villageData.highlights.empty")}
                </div>
              ) : (
                <div className="space-y-4">
                  {highlights.map((item, index) => (
                    <div key={item.id} className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">#{index + 1}</p>
                        <button
                          type="button"
                          onClick={() => setHighlights(highlights.filter((h) => h.id !== item.id))}
                          className="text-xs text-destructive hover:underline"
                        >
                          {t("villageData.highlights.remove")}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>{t("villageData.highlights.itemTitle")}</Label>
                          <Input
                            placeholder={t("villageData.highlights.itemTitlePlaceholder")}
                            value={item.title}
                            onChange={(e) =>
                              setHighlights(highlights.map((h) => h.id === item.id ? { ...h, title: e.target.value } : h))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("villageData.highlights.itemTag")}</Label>
                          <Input
                            placeholder={t("villageData.highlights.itemTagPlaceholder")}
                            value={item.tag}
                            onChange={(e) =>
                              setHighlights(highlights.map((h) => h.id === item.id ? { ...h, tag: e.target.value } : h))
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>{t("villageData.highlights.itemImage")}</Label>
                          <Input
                            placeholder={t("villageData.highlights.itemImagePlaceholder")}
                            value={item.image}
                            onChange={(e) =>
                              setHighlights(highlights.map((h) => h.id === item.id ? { ...h, image: e.target.value } : h))
                            }
                          />
                          {item.image && (
                            <div className="rounded-lg overflow-hidden h-32 bg-muted">
                              <ImagePreview src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>{t("villageData.highlights.itemDescription")}</Label>
                          <Textarea
                            rows={2}
                            placeholder={t("villageData.highlights.itemDescriptionPlaceholder")}
                            value={item.description}
                            onChange={(e) =>
                              setHighlights(highlights.map((h) => h.id === item.id ? { ...h, description: e.target.value } : h))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("highlights")}>
                  {savedTab === "highlights" ? `✓ ${t("villageData.saved")}` : t("actions.saveProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Media & Gallery ─────────────────────────── */}
        {activeTab === "media" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("villageData.tabs.media")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Cover photo */}
              <div className="space-y-3">
                <div>
                  <Label>{t("villageData.coverPhoto")}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("villageData.coverPhotoHint")}</p>
                </div>
                <Input
                  placeholder={t("villageData.coverPhotoPlaceholder")}
                  value={form.coverPhoto ?? ""}
                  onChange={(e) => setForm({ ...form, coverPhoto: e.target.value })}
                />
                {form.coverPhoto ? (
                  <div className="relative rounded-xl overflow-hidden h-52 bg-muted">
                    <ImagePreview
                      src={form.coverPhoto}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white text-xs font-medium">
                      {t("villageData.coverPhoto")}
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed h-52 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                    <span className="text-3xl">🖼</span>
                    <span className="text-sm">{t("villageData.noPreview")}</span>
                  </div>
                )}
              </div>

              {/* Photo gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("villageData.gallery")}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("villageData.galleryHint")}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addGalleryItem}>
                    + {t("villageData.addPhoto")}
                  </Button>
                </div>

                {(form.gallery ?? []).length > 0 && (
                  <div className="space-y-2">
                    {(form.gallery ?? []).map((url, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          placeholder={t("villageData.photoUrlPlaceholder")}
                          value={url}
                          onChange={(e) => updateGallery(i, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors px-2 text-sm shrink-0"
                          aria-label={t("villageData.removePhoto")}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {filledGallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {filledGallery.map((url, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <ImagePreview src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promotional video */}
              <div className="space-y-3">
                <div>
                  <Label>{t("villageData.videoUrl")}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("villageData.videoUrlHint")}</p>
                </div>
                <Input
                  placeholder={t("villageData.videoUrlPlaceholder")}
                  value={form.videoUrl ?? ""}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                />
                {form.videoUrl ? (
                  embedUrl ? (
                    <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-md">
                      <iframe
                        src={embedUrl}
                        title="Village promotional video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg">
                      ⚠ {t("villageData.invalidVideo")}
                    </p>
                  )
                ) : (
                  <div className="rounded-xl border-2 border-dashed aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                    <span className="text-3xl">▶</span>
                    <span className="text-sm">{t("villageData.noVideo")}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("media")}>
                  {savedTab === "media" ? `✓ ${t("villageData.saved")}` : t("actions.saveProfile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

    </div>
  );
}
