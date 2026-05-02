"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PartnerApplication } from "../types";

const PROGRESS_STEPS = [
  "submitted",
  "document_review",
  "location_verification",
  "approval",
  "active",
] as const;

type ProgressStep = (typeof PROGRESS_STEPS)[number];

function mapCurrentStep(application: PartnerApplication): ProgressStep {
  if (application.partnerStatus === "active" || application.status === "approved") return "active";
  if (application.status === "under_review") {
    if (application.checklist.documents && application.checklist.location) return "approval";
    if (application.checklist.documents) return "location_verification";
    return "document_review";
  }
  return "submitted";
}

function maskAccount(value?: string): string {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

export function PartnerDetail({ application }: { application: PartnerApplication }) {
  const t = useTranslations("village");
  const locale = useLocale();

  const currentStep = useMemo(() => mapCurrentStep(application), [application]);
  const currentStepIndex = PROGRESS_STEPS.indexOf(currentStep);

  const timeline = [
    { key: "submitted", label: t("partners.progress.submitted") },
    { key: "document_review", label: t("partners.progress.documentReview") },
    { key: "location_verification", label: t("partners.progress.locationVerification") },
    { key: "approval", label: t("partners.progress.approval") },
    { key: "active", label: t("partners.progress.active") },
  ] as const;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.detailTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm text-on-surface/80 md:grid-cols-2">
          <p><span className="font-medium">{t("partners.organizationLabel")}:</span> {application.organizationName}</p>
          <p><span className="font-medium">{t("partners.role")}:</span> {t(`partners.roles.${application.role}`)}</p>
          <p><span className="font-medium">{t("partners.ownerName")}:</span> {application.ownerName}</p>
          <p><span className="font-medium">{t("partners.ownerEmail")}:</span> {application.ownerEmail ?? "-"}</p>
          <p><span className="font-medium">{t("partners.ownerPhone")}:</span> {application.ownerPhone ?? "-"}</p>
          <p><span className="font-medium">{t("partners.submittedAt")}:</span> {new Date(application.submittedAt).toLocaleDateString(locale)}</p>
          <p><span className="font-medium">{t("partners.completionScore")}:</span> {application.completionScore}%</p>
          <p><span className="font-medium">{t("partners.currentStatus")}:</span> <Badge variant={application.status === "approved" ? "default" : "secondary"}>{t(`approval.statuses.${application.status}`)}</Badge></p>
          <p className="md:col-span-2"><span className="font-medium">{t("partners.businessType")}:</span> {application.businessType ?? "-"}</p>
          <p className="md:col-span-2"><span className="font-medium">{t("partners.businessAddress")}:</span> {application.address ?? "-"}</p>
          <p className="md:col-span-2"><span className="font-medium">{t("partners.descriptionLabel")}:</span> {application.description ?? "-"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.progressTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {timeline.map((step, index) => {
            const done = index < currentStepIndex;
            const current = index === currentStepIndex;
            return (
              <div key={step.key} className="flex items-center gap-3">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${done ? "bg-primary text-white" : current ? "bg-amber-500 text-white" : "bg-surface-container-high text-on-surface/70"}`}>
                  {done ? "✓" : index + 1}
                </span>
                <span className={`text-sm ${done || current ? "text-on-surface" : "text-on-surface/60"}`}>{step.label}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.activityLog")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(application.activityLog ?? []).length > 0 ? (
            (application.activityLog ?? []).map((log) => (
              <div key={log.id} className="rounded-lg border border-surface-container-high px-3 py-2">
                <p className="text-sm font-medium text-on-surface">{t(`approval.statuses.${log.status}`)}</p>
                <p className="text-xs text-on-surface/60">{new Date(log.createdAt).toLocaleString(locale)}</p>
                <p className="mt-1 text-sm text-on-surface/80">{log.note}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-on-surface/60">{t("partners.noActivity")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.financialInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 text-sm text-on-surface/80 md:grid-cols-3">
          <p><span className="font-medium">{t("partners.bankName")}:</span> {application.bankAccount?.bankName ?? "-"}</p>
          <p><span className="font-medium">{t("partners.accountHolder")}:</span> {application.bankAccount?.accountHolder ?? "-"}</p>
          <p><span className="font-medium">{t("partners.accountNumber")}:</span> {maskAccount(application.bankAccount?.accountNumber)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
