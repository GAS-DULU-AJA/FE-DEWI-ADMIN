"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Download, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { formatCurrency } from "@/lib/utils";
import { FACILITY_INVOICES } from "../mock-data";
import type { FacilityInvoice, InvoiceStatus } from "../types";

const STATUS_META: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "red" | "amber"; icon: React.ReactNode }> = {
  pending_payment: {
    label: "Menunggu Pembayaran",
    variant: "amber",
    icon: <Clock className="h-3 w-3" />,
  },
  paid: {
    label: "Lunas",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "secondary",
    icon: <XCircle className="h-3 w-3" />,
  },
  overdue: {
    label: "Jatuh Tempo",
    variant: "red",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function InvoiceRow({ invoice }: { invoice: FacilityInvoice }) {
  const meta = STATUS_META[invoice.status];
  return (
    <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-on-surface">{invoice.eventName}</p>
          <p className="text-xs text-on-surface/60">{invoice.organizerName}</p>
          <p className="mt-1 font-mono text-xs text-on-surface/40">{invoice.invoiceNumber}</p>
        </div>
        <Badge variant={meta.variant} className="flex items-center gap-1 shrink-0">
          {meta.icon}
          {meta.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {invoice.items.map((item) => (
          <div key={item.facilityId} className="col-span-2 flex justify-between border-b border-surface-container-high pb-1">
            <span className="text-on-surface/70">{item.facilityName} × {item.durationDays} hari</span>
            <span className="font-medium text-on-surface">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
        <span className="text-on-surface/60">Tanggal Event</span>
        <span className="text-right text-on-surface">{invoice.eventDate}</span>
        <span className="text-on-surface/60">Jatuh Tempo</span>
        <span className="text-right text-on-surface">{invoice.dueDate}</span>
        {invoice.paidAt && (
          <>
            <span className="text-on-surface/60">Dibayar</span>
            <span className="text-right text-emerald-600">{invoice.paidAt}</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-on-surface/50">Total</p>
          <p className="text-base font-bold text-primary">{formatCurrency(invoice.totalAmount)}</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Unduh Invoice
        </Button>
      </div>
    </div>
  );
}

interface FacilityInvoiceCardProps {
  coordinationRequestId?: string;
  showAll?: boolean;
}

export function FacilityInvoiceCard({ coordinationRequestId, showAll }: FacilityInvoiceCardProps) {
  const invoices = coordinationRequestId
    ? FACILITY_INVOICES.filter((inv) => inv.coordinationRequestId === coordinationRequestId)
    : FACILITY_INVOICES;

  const [confirmCreate, setConfirmCreate] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Invoice Sewa Fasilitas</CardTitle>
        </div>
        <Button size="sm" onClick={() => setConfirmCreate(true)}>
          + Buat Invoice
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {invoices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-surface-container-high py-8 text-center">
            <p className="text-sm text-on-surface/60">Belum ada invoice untuk koordinasi ini.</p>
            <p className="mt-1 text-xs text-on-surface/40">
              Invoice akan digenerate otomatis saat Anda menyetujui penggunaan fasilitas desa.
            </p>
          </div>
        ) : (
          invoices.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)
        )}

        <div className="rounded-lg border border-surface-container-high bg-surface-container-low px-3 py-2 text-xs text-on-surface/70">
          <span className="font-medium text-on-surface/80">Alur pembayaran: </span>
          Invoice diterbitkan → Organizer bayar → Saldo Desa bertambah → Event bisa dipublikasikan.
        </div>
      </CardContent>

      <ConfirmationDialog
        open={confirmCreate}
        onCancel={() => setConfirmCreate(false)}
        title="Buat Invoice Sewa Fasilitas?"
        description="Invoice akan dikirimkan ke organizer. Event hanya bisa dipublikasikan setelah invoice ini dilunasi."
        confirmText="Buat Invoice"
        onConfirm={() => setConfirmCreate(false)}
      />
    </Card>
  );
}
