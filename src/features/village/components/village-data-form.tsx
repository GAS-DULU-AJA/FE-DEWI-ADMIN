"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { VILLAGE_PROFILE } from "../mock-data";
import { maskBankAccount } from "../utils";
import type { VillageProfile } from "../types";

type Tab = "profile" | "location" | "media" | "bank";

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

export function VillageDataForm() {
  const t = useTranslations("village");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [form, setForm] = useState<VillageProfile>(VILLAGE_PROFILE);
  const [savedTab, setSavedTab] = useState<Tab | null>(null);

  function handleSave(tab: Tab) {
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: t("villageData.tabs.profile") },
    { key: "location", label: t("villageData.tabs.locationContact") },
    { key: "media", label: t("villageData.tabs.media") },
    { key: "bank", label: t("villageData.tabs.bank") },
  ];

  const embedUrl = form.videoUrl ? getYouTubeEmbedUrl(form.videoUrl) : null;
  const filledGallery = (form.gallery ?? []).filter((u) => u.trim());

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* ─── Form panel ─────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Tab bar */}
        <div className="flex gap-1 rounded-xl border bg-muted/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-background shadow-sm text-foreground"
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
              <div className="space-y-2">
                <Label>{t("villageData.taxId")}</Label>
                <Input
                  placeholder={t("villageData.taxIdPlaceholder")}
                  value={form.taxId ?? ""}
                  onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                />
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

              <div className="border-t pt-5 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("villageData.contactPhone")}</Label>
                  <Input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("villageData.contactEmail")}</Label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>{t("villageData.website")}</Label>
                  <Input
                    type="url"
                    value={form.website ?? ""}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-5 space-y-3">
                <p className="text-sm font-medium">{t("villageData.socialMedia")}</p>
                {(
                  [
                    { key: "instagram", placeholder: "@namaakun" },
                    { key: "facebook", placeholder: "Nama halaman atau URL" },
                    { key: "youtube", placeholder: "https://youtube.com/@channel" },
                  ] as const
                ).map(({ key, placeholder }) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-muted-foreground capitalize">{key}</span>
                    <Input
                      placeholder={placeholder}
                      value={form.socialMedia?.[key] ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialMedia: { ...form.socialMedia, [key]: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => handleSave("location")}>
                  {savedTab === "location" ? `✓ ${t("villageData.saved")}` : t("actions.saveProfile")}
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

        {/* ── Tab: Bank Account ────────────────────────────── */}
        {activeTab === "bank" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("villageData.bankTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠ {t("villageData.bankWarning")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("villageData.bankAccountName")}</Label>
                  <Input
                    value={form.bankAccountName}
                    onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("villageData.bankName")}</Label>
                  <Input
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("villageData.bankAccountNumber")}</Label>
                  <Input
                    value={form.bankAccountNumber}
                    onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("villageData.maskedPreview")}</Label>
                  <Input disabled value={maskBankAccount(form.bankAccountNumber)} className="font-mono" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => handleSave("bank")}>
                  {savedTab === "bank" ? `✓ ${t("villageData.saved")}` : t("actions.updateBank")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Live preview panel ─────────────────────────────── */}
      <div className="space-y-4">
        <Card className="sticky top-4 overflow-hidden">
          <div className="relative h-36 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800">
            {form.coverPhoto && (
              <ImagePreview
                src={form.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-2 right-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-xs">
                {t("villageData.verifiedBadge")}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
              <p className="text-white text-xs font-medium opacity-70">{t("villageData.profilePreview")}</p>
              <h3 className="text-white font-bold text-base leading-tight truncate">
                {form.villageName || "—"}
              </h3>
            </div>
          </div>

          <CardContent className="pt-4 space-y-4">
            {/* Address */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              📍 {form.address || "—"}
            </p>

            {/* Description */}
            {form.description && (
              <p className="text-xs leading-relaxed line-clamp-4">{form.description}</p>
            )}

            {/* Contact */}
            <div className="space-y-1 text-xs text-muted-foreground">
              {form.contactPhone && <p>📞 {form.contactPhone}</p>}
              {form.contactEmail && <p>✉ {form.contactEmail}</p>}
              {form.website && (
                <p className="truncate">
                  🌐{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">{form.website}</span>
                </p>
              )}
            </div>

            {/* Social media */}
            {(form.socialMedia?.instagram || form.socialMedia?.facebook || form.socialMedia?.youtube) && (
              <div className="flex flex-wrap gap-1.5">
                {form.socialMedia.instagram && (
                  <Badge variant="outline" className="text-xs">
                    📷 {form.socialMedia.instagram}
                  </Badge>
                )}
                {form.socialMedia.facebook && (
                  <Badge variant="outline" className="text-xs">
                    👥 {form.socialMedia.facebook}
                  </Badge>
                )}
                {form.socialMedia.youtube && (
                  <Badge variant="outline" className="text-xs">
                    ▶ YouTube
                  </Badge>
                )}
              </div>
            )}

            {/* Gallery thumbnails */}
            {filledGallery.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  {t("villageData.gallery")} · {filledGallery.length}{" "}
                  {t("villageData.photos")}
                </p>
                <div className="flex gap-1.5 overflow-hidden">
                  {filledGallery.slice(0, 4).map((url, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                    >
                      <ImagePreview src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {filledGallery.length > 4 && (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                      +{filledGallery.length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video indicator */}
            {form.videoUrl && embedUrl && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2">
                <span className="text-red-500 text-lg">▶</span>
                <div className="text-xs">
                  <p className="font-medium text-red-700 dark:text-red-300">
                    {t("villageData.videoUrl")}
                  </p>
                  <p className="text-muted-foreground truncate max-w-[140px]">{form.videoUrl}</p>
                </div>
              </div>
            )}

            {/* Bank info */}
            <div className="border-t pt-3 space-y-1 text-xs">
              <p className="text-muted-foreground font-medium">{t("villageData.bankTitle")}</p>
              <p className="font-medium">{form.bankAccountName}</p>
              <p className="text-muted-foreground">
                {form.bankName} · {maskBankAccount(form.bankAccountNumber)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
