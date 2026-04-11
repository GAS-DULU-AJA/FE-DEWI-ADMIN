"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STEPS = ["basic", "schedule", "tickets", "media", "review"] as const;

export function ExperienceWizard() {
  const t = useTranslations("village");
  const [stepIndex, setStepIndex] = useState(0);

  // Step 2 — Ticket state
  const [priceAdult, setPriceAdult] = useState(0);
  const [priceChild, setPriceChild] = useState(0);
  const [maxPerBooking, setMaxPerBooking] = useState(10);
  const [bookingDeadline, setBookingDeadline] = useState(24);
  const [autoConfirm, setAutoConfirm] = useState(false);

  // Step 3 — Media state
  const [coverPhoto, setCoverPhoto] = useState("");
  const [gallery, setGallery] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("experiences.wizardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 text-xs">
          {STEPS.map((step, idx) => (
            <span
              key={step}
              className={`rounded-full px-3 py-1 ${idx === stepIndex ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
            >
              {t(`experiences.steps.${step}`)}
            </span>
          ))}
        </div>

        {stepIndex === 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("common.name")}</Label>
              <Input />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.category")}</Label>
              <select className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm">
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
              <Textarea rows={4} />
            </div>
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("experiences.startsAt")}</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.endsAt")}</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.capacity")}</Label>
              <Input type="number" min={1} />
            </div>
            <div className="space-y-2">
              <Label>{t("experiences.pricePerPerson")}</Label>
              <Input type="number" min={0} />
            </div>
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-700">{t("experiences.wizard.ticketsTitle")}</p>
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
              <label className="flex items-center gap-2 text-sm text-stone-700 md:col-span-2">
                <input type="checkbox" checked={autoConfirm} onChange={(e) => setAutoConfirm(e.target.checked)} />
                {t("experiences.wizard.autoConfirm")}
              </label>
            </div>
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-700">{t("experiences.wizard.mediaTitle")}</p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>{t("experiences.wizard.coverPhotoHint")}</Label>
                <Input value={coverPhoto} onChange={(e) => setCoverPhoto(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.galleryHint")}</Label>
                <Textarea rows={3} value={gallery} onChange={(e) => setGallery(e.target.value)} placeholder="https://..., https://..." />
              </div>
              <div className="space-y-2">
                <Label>{t("experiences.wizard.videoUrl")}</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>
        ) : null}

        {stepIndex === 4 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-stone-700">{t("experiences.wizard.reviewTitle")}</p>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              {t("experiences.wizard.publishNote")}
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" />
              {t("experiences.wizard.readyLabel")}
            </label>
          </div>
        ) : null}

        <div className="flex justify-between">
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
