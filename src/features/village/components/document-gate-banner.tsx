"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, FileUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormModal } from "@/components/ui/form-modal";
import { DOCUMENT_VERIFICATION } from "../mock-data";
import type { LegalDocStatus, LegalDocument } from "../types";

const STATUS_META: Record<LegalDocStatus, { label: string; icon: React.ReactNode; color: string }> = {
  not_uploaded: {
    label: "Belum Diupload",
    icon: <FileUp className="h-3.5 w-3.5" />,
    color: "text-on-surface/50",
  },
  pending_review: {
    label: "Menunggu Verifikasi",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-amber-600",
  },
  verified: {
    label: "Terverifikasi",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-emerald-600",
  },
  rejected: {
    label: "Ditolak",
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "text-red-600",
  },
};

function DocRow({ doc }: { doc: LegalDocument }) {
  const meta = STATUS_META[doc.status];
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-surface-container-high px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-on-surface">{doc.label}</p>
        {doc.reviewNote && (
          <p className="mt-0.5 text-xs text-on-surface/60">{doc.reviewNote}</p>
        )}
        {doc.uploadedAt && (
          <p className="mt-0.5 text-xs text-on-surface/40">Diupload: {doc.uploadedAt}</p>
        )}
      </div>
      <span className={`flex shrink-0 items-center gap-1 text-xs font-medium ${meta.color}`}>
        {meta.icon}
        {meta.label}
      </span>
    </div>
  );
}

export function DocumentGateBanner() {
  const state = DOCUMENT_VERIFICATION;
  const [open, setOpen] = useState(false);

  if (state.isTransactionEnabled) return null;

  const missingCount = state.documents.filter(
    (d) => d.status === "not_uploaded" || d.status === "rejected"
  ).length;

  return (
    <>
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Fitur Transaksi Belum Aktif
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
            Lengkapi verifikasi dokumen legalitas ({missingCount} dokumen perlu perhatian) agar fitur
            pembayaran dan pencairan aktif.
          </p>
        </div>
        <Button size="sm" variant="outline" className="shrink-0 border-amber-500/40 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400" onClick={() => setOpen(true)}>
          Lihat Detail
        </Button>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="Verifikasi Dokumen Legalitas"
        description="Lengkapi semua dokumen berikut agar fitur transaksi, split payment, dan penarikan saldo aktif."
        size="md"
        submitLabel="Upload Dokumen"
        onSubmit={() => setOpen(false)}
      >
        <div className="space-y-2">
          {state.documents.map((doc) => (
            <DocRow key={doc.id} doc={doc} />
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-surface-container-high bg-surface-container-low p-3 text-xs text-on-surface/70">
          <p className="font-medium text-on-surface/80">Catatan:</p>
          <p className="mt-1">
            Setelah semua dokumen terverifikasi oleh tim DeWi (1–2 hari kerja), fitur pembayaran
            terpadu, split payment otomatis, dan penarikan saldo akan diaktifkan secara otomatis.
          </p>
        </div>
      </FormModal>
    </>
  );
}
