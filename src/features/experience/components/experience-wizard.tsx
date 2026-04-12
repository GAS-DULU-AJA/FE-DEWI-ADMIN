"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EVENT_LOCATION_TYPES,
  EVENT_VISIBILITIES,
  EXPERIENCE_CATEGORIES,
  REFUND_POLICIES,
} from "@/features/experience/constants";
import { useLocale, useTranslations } from "next-intl";

const STEPS = ["basic", "schedule", "tickets", "itinerary", "media", "review"] as const;

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

  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleEnd, setScheduleEnd] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [agendaSummary, setAgendaSummary] = useState("");
  const [speakerAssignment, setSpeakerAssignment] = useState("");

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

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [supportingImages, setSupportingImages] = useState<File[]>([]);

  const posterPreview = useMemo(() => (posterFile ? URL.createObjectURL(posterFile) : ""), [posterFile]);
  const bannerPreview = useMemo(() => (bannerFile ? URL.createObjectURL(bannerFile) : ""), [bannerFile]);

  const formatBytes = (size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    if (size >= 1024) return `${Math.round(size / 1024)} KB`;
    return `${size} B`;
  };

  const summaryItems = [
    `${isId ? "Nama" : "Name"}: ${name || "-"}`,
    `${isId ? "Kategori" : "Category"}: ${t(`categories.${category}`)}`,
    `${isId ? "Lokasi" : "Location"}: ${locationName || "-"}`,
    `${isId ? "Visibilitas" : "Visibility"}: ${t(`visibility.${visibility}`)}`,
    `${isId ? "Jadwal" : "Schedule"}: ${scheduleStart || "-"} ${scheduleEnd ? `-> ${scheduleEnd}` : ""}`,
    `${isId ? "Tipe Event" : "Event Type"}: ${isPaidEvent ? (isId ? "Berbayar" : "Paid") : (isId ? "Gratis" : "Free")}`,
    `${isId ? "Poster" : "Poster"}: ${posterFile?.name || "-"}`,
    `${isId ? "Gambar Pendukung" : "Supporting Images"}: ${supportingImages.length}`,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("components.wizardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {STEPS.map((step, idx) => (
            <span key={step} className={`rounded-full px-3 py-1 ${idx === stepIndex ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}>
              {t(`components.steps.${step}`)}
            </span>
          ))}
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
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
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
              <Label>{isId ? "Visibilitas Event" : "Event Visibility"}</Label>
              <select
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as (typeof EVENT_VISIBILITIES)[number])}
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
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
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
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
            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={isMultiDay} onChange={(event) => setIsMultiDay(event.target.checked)} />
              {isId ? "Event multi-hari" : "Multi-day event"}
            </label>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Ringkasan Agenda / Rundown" : "Agenda Summary"}</Label>
              <Textarea value={agendaSummary} onChange={(event) => setAgendaSummary(event.target.value)} rows={4} placeholder={isId ? "Tuliskan alur sesi event" : "Describe the event session flow"} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{isId ? "Assign Pembicara / Talent" : "Speaker / Talent Assignment"}</Label>
              <Input value={speakerAssignment} onChange={(event) => setSpeakerAssignment(event.target.value)} placeholder={isId ? "Contoh: Ibu Ratna (Keynote), Pak Wayan (Closing)" : "Example: Alice (Keynote), Bob (Closing)"} />
            </div>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="space-y-4">
            <label className="inline-flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={isPaidEvent} onChange={(event) => setIsPaidEvent(event.target.checked)} />
              {isId ? "Event berbayar" : "Paid event"}
            </label>

            <div className="rounded-lg border border-stone-200 p-3">
              <p className="mb-2 text-sm font-semibold text-stone-900">Regular</p>
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

            <div className="rounded-lg border border-stone-200 p-3">
              <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
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

            <div className="rounded-lg border border-stone-200 p-3">
              <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
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
                  className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                >
                  {REFUND_POLICIES.map((policy) => (
                    <option key={policy} value={policy}>{policy}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {stepIndex === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-stone-600">
              {isId
                ? "Lengkapi minimal satu sesi agenda untuk memudahkan tim operasional mendeteksi bentrok jadwal."
                : "Add at least one agenda session so operations can identify schedule conflicts."}
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
              <div className="space-y-2 md:col-span-2">
                <Label>{isId ? "Deskripsi Sesi" : "Session Description"}</Label>
                <Textarea value={sessionDescription} onChange={(event) => setSessionDescription(event.target.value)} rows={3} />
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              {isId
                ? "Catatan: Sistem akan menandai potensi konflik bila waktu sesi saling bertabrakan di lokasi yang sama."
                : "Note: The system marks potential conflicts when sessions overlap in the same location."}
            </div>
          </div>
        )}

        {stepIndex === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="space-y-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
                <Label>{isId ? "Upload Poster Event" : "Upload Event Poster"}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setPosterFile(event.target.files?.[0] ?? null)}
                />
                {posterFile ? (
                  <div className="text-xs text-stone-600">
                    <p className="font-medium text-stone-800">{posterFile.name}</p>
                    <p>{formatBytes(posterFile.size)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">{t("components.posterPlaceholder")}</p>
                )}
                {posterPreview ? <img src={posterPreview} alt="Poster preview" className="h-28 w-full rounded-md border border-stone-200 object-cover" /> : null}
              </div>

              <div className="space-y-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
                <Label>{isId ? "Upload Banner Pendukung" : "Upload Supporting Banner"}</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)}
                />
                {bannerFile ? (
                  <div className="text-xs text-stone-600">
                    <p className="font-medium text-stone-800">{bannerFile.name}</p>
                    <p>{formatBytes(bannerFile.size)}</p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">{t("components.bannerPlaceholder")}</p>
                )}
                {bannerPreview ? <img src={bannerPreview} alt="Banner preview" className="h-28 w-full rounded-md border border-stone-200 object-cover" /> : null}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
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
                <ul className="space-y-1 text-xs text-stone-700">
                  {supportingImages.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between rounded-md bg-white px-2 py-1">
                      <span className="truncate">{file.name}</span>
                      <span className="text-stone-500">{formatBytes(file.size)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-500">{isId ? "Belum ada gambar pendukung dipilih." : "No supporting images selected yet."}</p>
              )}
            </div>
          </div>
        )}

        {stepIndex === 5 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-stone-900">{isId ? "Review Data Experience" : "Review Experience Data"}</p>
            <ul className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
              {summaryItems.map((item) => (
                <li key={item} className="border-b border-stone-200 pb-1 last:border-b-0 last:pb-0">{item}</li>
              ))}
            </ul>
            <label className="inline-flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" />
              {isId
                ? "Saya memastikan data event sudah benar dan siap diproses."
                : "I confirm the event data is correct and ready to be processed."}
            </label>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex((v) => Math.max(0, v - 1))}>{t("components.previous")}</Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button onClick={() => setStepIndex((v) => Math.min(STEPS.length - 1, v + 1))}>{t("components.next")}</Button>
          ) : (
            <Button>{t("components.submitProposal")}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
