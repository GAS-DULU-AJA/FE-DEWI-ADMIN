"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
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
  const tc = useTranslations("common");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState<EventDocumentType>("other");

  const typeColors: Record<string, string> = {
    contract: "bg-blue-100 text-blue-700",
    rundown: "bg-violet-100 text-violet-700",
    permit: "bg-primary/10 text-primary",
    invoice: "bg-amber-100 text-amber-700",
    other: "bg-surface-container text-on-surface/70",
  };

  const columns: ColumnDef<EventDocument>[] = [
    {
      id: "name",
      header: t("documents.fileName"),
      accessorKey: "name",
      sortable: true,
    },
    {
      id: "type",
      header: t("documents.docType"),
      accessorKey: "type",
      sortable: true,
      filterable: true,
      filterOptions: EVENT_DOCUMENT_TYPES.map((type) => ({
        value: type,
        label: t(`documents.types.${type}`),
      })),
      accessorFn: (row) => t(`documents.types.${row.type}`),
    },
    {
      id: "size",
      header: "Size",
      accessorFn: (row) => (row.fileSize ? formatFileSize(row.fileSize) : "-"),
      sortable: true,
    },
    {
      id: "uploadedAt",
      header: tc("date"),
      accessorKey: "uploadedAt",
      accessorFn: (row) => new Date(row.uploadedAt).toLocaleDateString(),
      sortable: true,
    },
  ];

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
                className="h-10 w-full rounded-lg border border-surface-container-high px-3 text-sm"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as EventDocumentType)}
              >
                {EVENT_DOCUMENT_TYPES.map((dt) => (
                  <option key={dt} value={dt}>{t(`documents.types.${dt}`)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-lowest p-6 text-center text-sm text-on-surface/60">
            {t("documents.dropzone")}
          </div>
        </FormModal>

        <DataTable
          data={documents}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchableFields={["name", "type"]}
          searchPlaceholder={`${tc("search")}...`}
          pageSize={10}
          emptyState={{ title: t("documents.empty") }}
          actions={() => [
            { label: t("documents.view"), onClick: () => {} },
            { label: t("documents.download"), onClick: () => {} },
          ]}
          mobileCardRenderer={(doc) => (
            <div className="rounded-lg border border-surface-container-high p-3 text-sm">
              <p className="font-medium text-on-surface">{doc.name}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-on-surface/60">
                <Badge className={typeColors[doc.type] ?? typeColors.other}>{t(`documents.types.${doc.type}`)}</Badge>
                {doc.fileSize ? <span>{formatFileSize(doc.fileSize)}</span> : null}
                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
