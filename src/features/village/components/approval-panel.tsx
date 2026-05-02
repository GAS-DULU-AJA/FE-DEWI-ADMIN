"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, CheckCircle2, Clock, MapPin, Store, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PARTNER_APPLICATIONS } from "../mock-data";
import type { VillageApprovalStatus } from "@/types";
import type { PartnerApplication } from "../types";

const ROLE_ICON: Record<PartnerApplication["role"], React.ReactNode> = {
  accommodation: <Building2 className="h-3.5 w-3.5" />,
  sme: <Store className="h-3.5 w-3.5" />,
  external_experience: <Users className="h-3.5 w-3.5" />,
};

const VILLAGE_STATUS_META: Record<VillageApprovalStatus, { label: string; icon: React.ReactNode; className: string }> = {
  not_submitted:      { label: "Belum Diajukan",       icon: <Clock className="h-3 w-3" />,        className: "bg-surface-container text-on-surface/60" },
  pending_review:     { label: "Menunggu Review",      icon: <Clock className="h-3 w-3" />,        className: "bg-blue-100 text-blue-700" },
  approved:           { label: "Mitra Desa",           icon: <CheckCircle2 className="h-3 w-3" />, className: "bg-emerald-100 text-emerald-700" },
  rejected:           { label: "Ditolak",              icon: <XCircle className="h-3 w-3" />,      className: "bg-red-100 text-red-700" },
  revision_requested: { label: "Perlu Revisi",         icon: <Clock className="h-3 w-3" />,        className: "bg-amber-100 text-amber-700" },
};

export function ApprovalPanel() {
  const t = useTranslations("village");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(PARTNER_APPLICATIONS[0]?.id ?? "");
  const [feedback, setFeedback] = useState("");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PARTNER_APPLICATIONS.filter(
      (item) =>
        item.organizationName.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];
  const previewAsset = previewIndex != null ? (selected?.media ?? [])[previewIndex] : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("approval.inbox")}</CardTitle>
          {filtered[0]?.villageName ? (
            <p className="flex items-center gap-1.5 text-xs text-on-surface/50">
              <MapPin className="h-3 w-3" />
              Permohonan bergabung ke <span className="font-semibold text-on-surface/70">{filtered[0].villageName}</span>
            </p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("approval.searchPlaceholder")} />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  setFeedback(item.latestNote ?? "");
                }}
                className={`w-full rounded-lg border p-3 text-left ${selected?.id === item.id ? "border-primary/500 bg-primary/10" : "border-surface-container-high bg-surface-container-lowest"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-on-surface">{item.organizationName}</p>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${VILLAGE_STATUS_META[item.villageApprovalStatus].className}`}>
                    {VILLAGE_STATUS_META[item.villageApprovalStatus].icon}
                    {VILLAGE_STATUS_META[item.villageApprovalStatus].label}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-on-surface/60">
                  {ROLE_ICON[item.role]}
                  <span>{t(`partners.roles.${item.role}`)}</span>
                </div>
                <p className="text-xs text-on-surface/40">{item.ownerName}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("approval.reviewPanel")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-on-surface">{selected.organizationName}</p>
                  <p className="text-on-surface/60">{selected.ownerName}</p>
                  <p className="text-xs text-on-surface/40">{selected.ownerEmail ?? "-"} • {selected.ownerPhone ?? "-"}</p>
                  <p className="flex items-center gap-1 text-xs text-on-surface/50">
                    <MapPin className="h-3 w-3" /> Mendaftar ke: <span className="font-medium text-on-surface/70">{selected.villageName}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={selected.status === "approved" ? "default" : "secondary"}>
                    {t(`approval.statuses.${selected.status}`)}
                  </Badge>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${VILLAGE_STATUS_META[selected.villageApprovalStatus].className}`}>
                    {VILLAGE_STATUS_META[selected.villageApprovalStatus].icon}
                    {VILLAGE_STATUS_META[selected.villageApprovalStatus].label}
                  </span>
                </div>
              </div>

              <Accordion type="multiple" defaultValue={["business", "documents"]} className="rounded-xl border border-surface-container-high/70 px-4">
                <AccordionItem value="business">
                  <AccordionTrigger value="business">{t("approval.sections.businessInfo")}</AccordionTrigger>
                  <AccordionContent value="business" className="grid grid-cols-1 gap-2 text-sm text-on-surface/80 md:grid-cols-2">
                    <p><span className="font-medium">{t("partners.organizationLabel")}:</span> {selected.organizationName}</p>
                    <p><span className="font-medium">{t("partners.role")}:</span> {t(`partners.roles.${selected.role}`)}</p>
                    <p><span className="font-medium">{t("partners.ownerName")}:</span> {selected.ownerName}</p>
                    <p><span className="font-medium">{t("partners.ownerEmail")}:</span> {selected.ownerEmail ?? "-"}</p>
                    <p><span className="font-medium">{t("partners.ownerPhone")}:</span> {selected.ownerPhone ?? "-"}</p>
                    <p><span className="font-medium">{t("partners.businessType")}:</span> {selected.businessType ?? "-"}</p>
                    <p className="md:col-span-2"><span className="font-medium">{t("partners.businessAddress")}:</span> {selected.address ?? "-"}</p>
                    <p className="md:col-span-2"><span className="font-medium">{t("partners.descriptionLabel")}:</span> {selected.description ?? "-"}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="documents">
                  <AccordionTrigger value="documents">{t("approval.sections.documents")}</AccordionTrigger>
                  <AccordionContent value="documents" className="space-y-2 text-sm">
                    {(selected.documents ?? []).length > 0 ? (
                      (selected.documents ?? []).map((document) => (
                        <div key={`${document.type}-${document.fileName}`} className="flex items-center justify-between gap-2 rounded-lg border border-surface-container-high px-3 py-2">
                          <div>
                            <p className="font-medium text-on-surface">{document.type}</p>
                            <p className="text-xs text-on-surface/60">{document.fileName}</p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={document.fileUrl} target="_blank" rel="noreferrer">{t("approval.openDocument")}</a>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-on-surface/60">{t("approval.noDocuments")}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location">
                  <AccordionTrigger value="location">{t("approval.sections.location")}</AccordionTrigger>
                  <AccordionContent value="location" className="space-y-2 text-sm text-on-surface/80">
                    <p><span className="font-medium">{t("partners.businessAddress")}:</span> {selected.location?.address ?? "-"}</p>
                    <p><span className="font-medium">Lat/Lng:</span> {selected.location ? `${selected.location.latitude}, ${selected.location.longitude}` : "-"}</p>
                    {selected.location?.googleMapsUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selected.location.googleMapsUrl} target="_blank" rel="noreferrer">{t("approval.openMap")}</a>
                      </Button>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="financial">
                  <AccordionTrigger value="financial">{t("approval.sections.financial")}</AccordionTrigger>
                  <AccordionContent value="financial" className="grid grid-cols-1 gap-2 text-sm text-on-surface/80 md:grid-cols-3">
                    <p><span className="font-medium">{t("partners.bankName")}:</span> {selected.bankAccount?.bankName ?? "-"}</p>
                    <p><span className="font-medium">{t("partners.accountHolder")}:</span> {selected.bankAccount?.accountHolder ?? "-"}</p>
                    <p><span className="font-medium">{t("partners.accountNumber")}:</span> {selected.bankAccount?.accountNumber ?? "-"}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="media">
                  <AccordionTrigger value="media">{t("approval.sections.media")}</AccordionTrigger>
                  <AccordionContent value="media" className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {(selected.media ?? []).length > 0 ? (
                      (selected.media ?? []).map((asset, index) => (
                        <button
                          key={`${asset.type}-${index}`}
                          type="button"
                          onClick={() => setPreviewIndex(index)}
                          className="rounded-lg border border-surface-container-high p-2 text-left hover:border-primary/400"
                        >
                          <p className="text-xs font-medium text-on-surface/60">{asset.type.toUpperCase()}</p>
                          <p className="truncate text-sm text-on-surface">{asset.title}</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-on-surface/60">{t("approval.noMedia")}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-1 rounded-lg border border-surface-container-high p-3 text-sm">
                {Object.entries(selected.checklist).map(([key, done]) => (
                  <label key={key} className="flex items-center gap-2 text-on-surface/80">
                    <input type="checkbox" checked={done} readOnly />
                    <span>{t(`partners.checklistFields.${key}`)}</span>
                  </label>
                ))}
              </div>

              <Textarea
                rows={4}
                placeholder={t("approval.feedbackPlaceholder")}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
              />

              <div className="sticky bottom-0 flex flex-wrap gap-2 rounded-xl border border-surface-container-high bg-surface-container-lowest p-3">
                <Button>
                  <CheckCircle2 className="h-4 w-4" />
                  Terima sebagai Mitra Desa
                </Button>
                <Button variant="destructive">{t("actions.reject")}</Button>
                <Button variant="outline">{t("actions.requestRevision")}</Button>
              </div>

              <Dialog open={previewIndex != null} onOpenChange={(open) => !open && setPreviewIndex(null)}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{previewAsset?.title ?? t("approval.sections.media")}</DialogTitle>
                  </DialogHeader>

                  {previewAsset ? (
                    previewAsset.type === "video" ? (
                      <video
                        className="max-h-[70vh] w-full rounded-lg bg-black"
                        src={previewAsset.fileUrl}
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={previewAsset.fileUrl}
                        alt={previewAsset.title}
                        className="max-h-[70vh] w-full rounded-lg object-contain"
                      />
                    )
                  ) : null}
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <p className="text-sm text-on-surface/60">{t("approval.noSelection")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
