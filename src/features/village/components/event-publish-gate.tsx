"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FACILITY_INVOICES } from "../mock-data";
import type { InvoiceStatus } from "../types";

interface EventPublishGateProps {
  coordinationRequestId: string;
  eventName: string;
}

type GateStatus = "no_facility" | "invoice_pending" | "invoice_paid" | "can_publish";

function getGateStatus(coordinationRequestId: string): {
  status: GateStatus;
  invoiceStatus?: InvoiceStatus;
} {
  const invoice = FACILITY_INVOICES.find(
    (inv) => inv.coordinationRequestId === coordinationRequestId
  );

  if (!invoice) return { status: "no_facility" };
  if (invoice.status === "paid") return { status: "invoice_paid" };
  return { status: "invoice_pending", invoiceStatus: invoice.status };
}

const GATE_META: Record<GateStatus, { label: string; description: string; color: string; icon: React.ReactNode; canPublish: boolean }> = {
  no_facility: {
    label: "Tidak Ada Fasilitas",
    description: "Event ini tidak menggunakan fasilitas berbayar. Dapat langsung dipublikasikan setelah disetujui.",
    color: "border-emerald-500/30 bg-emerald-500/10",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    canPublish: true,
  },
  invoice_pending: {
    label: "Menunggu Pembayaran Invoice",
    description: "Organizer harus melunasi Invoice Sewa Fasilitas sebelum event ini dapat dipublikasikan.",
    color: "border-amber-500/30 bg-amber-500/10",
    icon: <Clock className="h-4 w-4 text-amber-600" />,
    canPublish: false,
  },
  invoice_paid: {
    label: "Invoice Lunas",
    description: "Invoice sewa fasilitas telah dilunasi. Event siap dipublikasikan.",
    color: "border-emerald-500/30 bg-emerald-500/10",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    canPublish: true,
  },
  can_publish: {
    label: "Siap Publish",
    description: "Semua syarat terpenuhi. Event dapat dipublikasikan.",
    color: "border-emerald-500/30 bg-emerald-500/10",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    canPublish: true,
  },
};

export function EventPublishGate({ coordinationRequestId, eventName }: EventPublishGateProps) {
  const { status } = getGateStatus(coordinationRequestId);
  const meta = GATE_META[status];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        {meta.canPublish
          ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          : <Lock className="h-4 w-4 text-amber-600" />
        }
        <CardTitle className="text-base">Status Publikasi Event</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${meta.color}`}>
          {meta.icon}
          <div>
            <p className="text-sm font-semibold text-on-surface">{meta.label}</p>
            <p className="mt-0.5 text-xs text-on-surface/70">{meta.description}</p>
          </div>
          <Badge variant={meta.canPublish ? "default" : "amber"} className="ml-auto shrink-0 text-xs">
            {meta.canPublish ? "Bisa Publish" : "Belum Bisa"}
          </Badge>
        </div>

        {/* Flow diagram */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-on-surface/60">
          {[
            { label: "Submit Event", done: true },
            { label: "Approval Desa", done: status !== "no_facility" ? true : true },
            { label: "Invoice Sewa", done: status === "invoice_paid" || status === "no_facility", skip: status === "no_facility" },
            { label: "Bayar Invoice", done: status === "invoice_paid", skip: status === "no_facility" },
            { label: "Event Published", done: meta.canPublish && status !== "invoice_pending" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${step.done ? "bg-emerald-500 text-white" : step.skip ? "bg-surface-container text-on-surface/30" : "bg-amber-500/20 text-amber-600"}`}>
                {step.done ? "✓" : i + 1}
              </span>
              <span className={step.done ? "text-on-surface/70" : step.skip ? "text-on-surface/30 line-through" : "font-medium text-amber-600"}>
                {step.label}
              </span>
              {i < 4 && <span className="text-on-surface/30">→</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
