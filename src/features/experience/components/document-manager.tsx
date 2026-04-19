"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/form-modal";
import type { EventDocument, EventDocumentType } from "@/features/experience/types";
import { EVENT_DOCUMENT_TYPES } from "@/features/experience/constants";
import { useTranslations } from "next-intl";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentManager({ documents }: { documents: EventDocument[] }) {
  const t = useTranslations("experience");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState<EventDocumentType>("other");

  const typeColors: Record<string, string> = {
    contract: "bg-blue-100 text-blue-700",
    rundown: "bg-violet-100 text-violet-700",
    permit: "bg-emerald-100 text-emerald-700",
    invoice: "bg-amber-100 text-amber-700",
    other: "bg-stone-100 text-stone-600",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t("documents.title")}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowUpload(true)}>
            {t("documents.upload")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormModal
          open={showUpload}
          onOpenChange={setShowUpload}
          title={t("documents.upload")}
          size="md"
          submitLabel={t("documents.uploadFile")}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("documents.fileName")}</Label>
              <Input placeholder={t("documents.fileNamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("documents.docType")}</Label>
              <select
                className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as EventDocumentType)}
              >
                {EVENT_DOCUMENT_TYPES.map((dt) => (
                  <option key={dt} value={dt}>{t(`documents.types.${dt}`)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-500">
            {t("documents.dropzone")}
          </div>
        </FormModal>

        {documents.length === 0 ? (
          <p className="text-sm text-stone-500">{t("documents.empty")}</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-stone-200 p-3 text-sm">
              <div className="space-y-0.5">
                <p className="font-medium text-stone-900">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Badge className={typeColors[doc.type] ?? typeColors.other}>{t(`documents.types.${doc.type}`)}</Badge>
                  {doc.fileSize ? <span>{formatFileSize(doc.fileSize)}</span> : null}
                  <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">{t("documents.view")}</Button>
                <Button variant="ghost" size="sm">{t("documents.download")}</Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
