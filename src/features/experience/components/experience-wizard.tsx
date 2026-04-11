"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

const STEPS = ["basic", "schedule", "tickets", "itinerary", "media", "review"] as const;

export function ExperienceWizard() {
  const t = useTranslations("experience");
  const [stepIndex, setStepIndex] = useState(0);

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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("components.name")}</Label>
            <Input placeholder={t("components.experienceNamePlaceholder")} />
          </div>
          <div className="space-y-2">
            <Label>{t("components.category")}</Label>
            <Input placeholder={t("components.categoryPlaceholder")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>{t("components.description")}</Label>
            <Textarea rows={4} />
          </div>
        </div>

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
