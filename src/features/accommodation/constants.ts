import type {
  AccommodationSubmissionStatus,
  PaymentStatus,
} from "@/types";

export const SUBMISSION_STATUS_META: Record<
  AccommodationSubmissionStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-stone-100 text-stone-700",
  },
  submitted: {
    label: "Submitted",
    className: "bg-amber-100 text-amber-700",
  },
  revision: {
    label: "Revision Required",
    className: "bg-red-100 text-red-700",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700",
  },
  suspended: {
    label: "Suspended",
    className: "bg-violet-100 text-violet-700",
  },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
  },
  success: {
    label: "Success",
    className: "bg-emerald-100 text-emerald-700",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700",
  },
  refunded: {
    label: "Refunded",
    className: "bg-blue-100 text-blue-700",
  },
};

export const PAYMENT_GATEWAY_RECOMMENDATIONS = [
  {
    name: "Midtrans",
    reason:
      "Cocok untuk marketplace booking karena mendukung split payment, Snap UI, dan metode pembayaran populer di Indonesia.",
    methods: [
      "QRIS",
      "Virtual Account (BCA, BNI, Mandiri, BRI)",
      "GoPay, OVO, ShopeePay",
      "Kartu Kredit/Debit",
      "Alfamart/Indomaret",
    ],
  },
  {
    name: "Xendit",
    reason:
      "API modern untuk pembayaran dan disbursement, tepat untuk skenario multi-mitra dan settlement terjadwal.",
    methods: [
      "QRIS",
      "Virtual Account",
      "E-Wallet",
      "Retail Outlet",
      "Kartu Kredit",
    ],
  },
  {
    name: "DOKU",
    reason:
      "Gateway lokal yang stabil untuk volume transaksi besar dengan variasi kanal pembayaran domestik.",
    methods: [
      "Virtual Account",
      "E-Wallet",
      "Kartu Kredit/Debit",
    ],
  },
] as const;

export const SUBMISSION_DISCLAIMER =
  "Setiap pengajuan penginapan akan diverifikasi admin. Pengajuan dapat ditolak jika data, kualitas foto, lokasi, dokumen legal, atau harga tidak memenuhi standar platform.";
