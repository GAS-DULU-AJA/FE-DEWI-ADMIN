"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SPEAKERS } from "@/features/experience/mock-data";
import { CalendarDays, CheckCircle2, Image as ImageIcon, Mic2, Ticket, Sparkles } from "lucide-react";

const STEPS = ["basic", "schedule", "speakers", "tickets", "media", "review"] as const;

type StepKey = (typeof STEPS)[number];

const STEP_ICONS: Record<StepKey, React.ReactNode> = {
  basic: <Sparkles className="h-4 w-4" />,
  schedule: <CalendarDays className="h-4 w-4" />,
  speakers: <Mic2 className="h-4 w-4" />,
  tickets: <Ticket className="h-4 w-4" />,
  media: <ImageIcon className="h-4 w-4" />,
  review: <CheckCircle2 className="h-4 w-4" />,
};

export function ExperienceWizard() {
  const t = useTranslations("village");
  const locale = useLocale();
  const isId = locale === "id";
  const [stepIndex, setStepIndex] = useState(0);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("cultural");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);

  const [priceAdult, setPriceAdult] = useState(0);
  const [priceChild, setPriceChild] = useState(0);
  const [maxPerBooking, setMaxPerBooking] = useState(10);
  const [bookingDeadline, setBookingDeadline] = useState(24);
  const [autoConfirm, setAutoConfirm] = useState(false);

  const [coverPhoto, setCoverPhoto] = useState("");
  const [gallery, setGallery] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function toggleSpeaker(id: string) {
    setSelectedSpeakers((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  const selectedSpeakerNames = SPEAKERS.filter((item) => selectedSpeakers.includes(item.id)).map((item) => item.name);

  return (
    <Card className="overflow-hidden border-surface-container-high">
      <CardHeader className="border-b border-surface-container-high bg-gradient-to-br from-primary/10 via-white to-teal-50">
        <CardTitle className="text-xl text-on-surface">{t("experiences.wizardTitle")}</CardTitle>
        <p className="text-sm text-on-surface/70">
          {isId
            ? "Alur pengajuan experience dibuat bertahap agar data operasional, speaker, dan tiket lebih rapi sejak awal."
            : "The submission flow is step-based so operational data, speakers, and tickets stay structured from the start."}
        </p>
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-on-surface/60">
            <span>{isId ? "Progress Pengajuan" : "Submission Progress"}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-gradient-to-r from-primary/100 to-primary-container transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          {STEPS.map((step, idx) => (
            <button
              key={step}
              type="button"
              onClick={() => setStepIndex(idx)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-2.5 py-2 text-xs transition ${
                idx === stepIndex
                  ? "border-primary/500 bg-primary text-white"
                  : idx < stepIndex
                    ? "border-primary/200 bg-primary/10 text-primary"
                    : "border-surface-container-high bg-surface-container-lowest text-on-surface/70 hover:border-primary/200"
              }`}
            >
              {STEP_ICONS[step]}
              {t(`experiences.steps.${step}`)}
            </button>
          ))}
        </div>

        {stepIndex === 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("common.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={isId ? "Contoh: Jelajah Budaya Subak" : "Example: Subak Cultural Journey"} />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.category")}</Label>
              <select className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="cultural">{t("experiences.categories.cultural")}</option>
                <option value="nature">{t("experiences.categories.nature")}</option>
                <option value="culinary">{t("experiences.categories.culinary")}</option>
                <option value="craft">{t("experiences.categories.craft")}</option>
                <option value="sport">{t("experiences.categories.sport")}</option>
                <option value="education">{t("experiences.categories.education")}</option>
                <option value="other">{t("experiences.categories.other")}</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t("common.description")}</Label>
              <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={isId ? "Tuliskan manfaat experience, alur peserta, dan nilai unik desa." : "Describe participant flow, key benefits, and village uniqueness."} />
            </div>
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("experiences.startsAt")}</Label>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.endsAt")}</Label>
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.capacity")}</Label>
              <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.pricePerPerson")}</Label>
              <Input type="number" min={0} value={pricePerPerson} onChange={(e) => setPricePerPerson(Number(e.target.value))} />
            </div>
            <div className="rounded-xl border border-primary/100 bg-primary/10/70 p-3 text-xs text-primary md:col-span-2">
              {isId
                ? "Tips: selaraskan kapasitas dengan ketersediaan pemandu, fasilitas, dan keamanan lokasi."
                : "Tip: align capacity with guide availability, facility readiness, and site safety."}
            </div>
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-surface-container-high bg-surface-container-low p-3 text-sm text-on-surface/70">
              {isId
                ? "Pilih pengisi acara dari daftar yang sudah dikelola. Di sini hanya pemilihan, tanpa tambah/edit data pembicara."
                : "Choose speakers from managed records. This step is selection-only without create/edit actions."}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {SPEAKERS.map((speaker) => {
                const active = selectedSpeakers.includes(speaker.id);
                return (
                  <button
                    key={speaker.id}
                    type="button"
                    onClick={() => toggleSpeaker(speaker.id)}
                    className={`rounded-xl border p-3 text-left transition ${active ? "border-primary/500 bg-primary/10" : "border-surface-container-high bg-surface-container-lowest hover:border-primary/300"}`}
                  >
                    <p className="text-sm font-semibold text-on-surface">{speaker.name}</p>
                    <p className="mt-1 text-xs text-on-surface/60 line-clamp-2">{speaker.bio}</p>
                    <p className="mt-2 text-xs text-on-surface/70">{speaker.topics.join(" · ")}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-on-surface/80">{t("experiences.wizard.ticketsTitle")}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("experiences.wizard.priceAdult")}</Label>
                <Input type="number" min={0} value={priceAdult} onChange={(e) => setPriceAdult(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.priceChild")}</Label>
                <Input type="number" min={0} value={priceChild} onChange={(e) => setPriceChild(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.maxPerBooking")}</Label>
                <Input type="number" min={1} value={maxPerBooking} onChange={(e) => setMaxPerBooking(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.bookingDeadline")}</Label>
                <Input type="number" min={0} value={bookingDeadline} onChange={(e) => setBookingDeadline(Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2 text-sm text-on-surface/80 md:col-span-2">
                <input type="checkbox" checked={autoConfirm} onChange={(e) => setAutoConfirm(e.target.checked)} />
                {t("experiences.wizard.autoConfirm")}
              </label>
            </div>
          </div>
        ) : null}

        {stepIndex === 4 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-on-surface/80">{t("experiences.wizard.mediaTitle")}</p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>{t("experiences.wizard.coverPhotoHint")}</Label>
                <Input
                  value={coverPhoto}
                  onChange={(e) => setCoverPhoto(e.target.value)}
                  placeholder={t("experiences.wizard.coverPhotoPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.galleryHint")}</Label>
                <Textarea
                  rows={3}
                  value={gallery}
                  onChange={(e) => setGallery(e.target.value)}
                  placeholder={t("experiences.wizard.galleryPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.videoUrl")}</Label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder={t("experiences.wizard.videoPlaceholder")}
                />
              </div>
            </div>
          </div>
        ) : null}

        {stepIndex === 5 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-on-surface/80">{t("experiences.wizard.reviewTitle")}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-surface-container-high bg-surface-container-low p-4 text-sm text-on-surface/80">
                <p className="font-medium text-on-surface">{isId ? "Ringkasan Experience" : "Experience Summary"}</p>
                <p className="mt-2">{name || "-"}</p>
                <p className="text-xs text-on-surface/60">{description || "-"}</p>
                <p className="mt-2 text-xs text-on-surface/70">{startsAt || "-"} - {endsAt || "-"}</p>
                <p className="text-xs text-on-surface/70">{isId ? "Kapasitas" : "Capacity"}: {capacity}</p>
              </div>
              <div className="rounded-lg border border-surface-container-high bg-surface-container-low p-4 text-sm text-on-surface/80">
                <p className="font-medium text-on-surface">{isId ? "Operasional & Harga" : "Operational & Pricing"}</p>
                <p className="mt-2 text-xs text-on-surface/70">{isId ? "Harga dewasa" : "Adult price"}: Rp {priceAdult.toLocaleString("id-ID")}</p>
                <p className="text-xs text-on-surface/70">{isId ? "Harga anak" : "Child price"}: Rp {priceChild.toLocaleString("id-ID")}</p>
                <p className="text-xs text-on-surface/70">{isId ? "Maks. per booking" : "Max per booking"}: {maxPerBooking}</p>
                <p className="text-xs text-on-surface/70">{isId ? "Speaker terpilih" : "Selected speakers"}: {selectedSpeakerNames.length > 0 ? selectedSpeakerNames.join(", ") : "-"}</p>
              </div>
            </div>
            <div className="rounded-lg border border-primary/200 bg-primary/10 p-4 text-sm text-primary">
              {t("experiences.wizard.publishNote")}
            </div>
            <label className="flex items-center gap-2 text-sm text-on-surface/80">
              <input type="checkbox" />
              {t("experiences.wizard.readyLabel")}
            </label>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-between gap-2">
          <Button variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex((v) => Math.max(0, v - 1))}>
            {t("common.previous")}
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button onClick={() => setStepIndex((v) => Math.min(STEPS.length - 1, v + 1))}>{t("common.next")}</Button>
          ) : (
            <Button>{t("actions.publishExperience")}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
