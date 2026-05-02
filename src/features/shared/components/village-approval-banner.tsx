"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VillageApprovalStatus } from "@/types";

interface VillageApprovalBannerProps {
  villageName: string;
  status: VillageApprovalStatus;
  note?: string;
  /** Optional — show a CTA button to go to the village membership application */
  onApply?: () => void;
}

const META: Record<
  VillageApprovalStatus,
  { label: string; desc: string; icon: React.ReactNode; className: string }
> = {
  not_submitted: {
    label: "Belum Terdaftar sebagai Mitra Desa",
    desc: "Anda belum mengajukan permohonan bergabung ke desa. Ajukan sekarang agar bisnis Anda dapat tampil atas nama desa dan mengakses semua fitur mitra.",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  pending_review: {
    label: "Menunggu Persetujuan Pengelola Desa",
    desc: "Permohonan keanggotaan Anda sedang ditinjau. Anda belum dapat tampil atas nama desa hingga disetujui.",
    icon: <Clock className="h-4 w-4 animate-pulse" />,
    className: "border-blue-200 bg-blue-50 text-blue-900",
  },
  revision_requested: {
    label: "Pengelola Desa Meminta Revisi",
    desc: "Terdapat catatan dari pengelola desa. Lengkapi perbaikan yang diminta agar permohonan dapat diproses kembali.",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "border-orange-200 bg-orange-50 text-orange-900",
  },
  rejected: {
    label: "Permohonan Ditolak oleh Desa",
    desc: "Pengelola desa menolak permohonan keanggotaan Anda. Hubungi pengelola desa untuk informasi lebih lanjut.",
    icon: <XCircle className="h-4 w-4" />,
    className: "border-red-200 bg-red-50 text-red-900",
  },
  approved: {
    label: "Mitra Resmi Desa",
    desc: "",
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
};

/**
 * VillageApprovalBanner
 *
 * Shown on SME / Accommodation / Experience dashboards to communicate
 * the current village membership status. Hidden when already approved.
 */
export function VillageApprovalBanner({
  villageName,
  status,
  note,
  onApply,
}: VillageApprovalBannerProps) {
  // Already a full member — no banner needed
  if (status === "approved") return null;

  const meta = META[status];

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${meta.className}`}>
      <span className="mt-0.5 shrink-0">{meta.icon}</span>
      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">
            {meta.label}
            {villageName ? (
              <span className="ml-1 font-normal opacity-70">— {villageName}</span>
            ) : null}
          </p>
          <p className="text-xs opacity-75">{meta.desc}</p>
          {note ? (
            <p className="mt-1 text-xs italic opacity-60">
              Catatan pengelola: {note}
            </p>
          ) : null}
        </div>

        {status === "not_submitted" && onApply ? (
          <Button size="sm" variant="outline" onClick={onApply} className="mt-2 shrink-0 sm:mt-0">
            Ajukan Keanggotaan
          </Button>
        ) : null}
      </div>
    </div>
  );
}
