import type {
  PaymentGatewayConfig,
  CancellationPolicy,
  PaymentTransaction,
  RefundRequest,
} from "./types";

export const DEFAULT_GATEWAY_CONFIG: PaymentGatewayConfig = {
  provider: "midtrans",
  environment: "sandbox",
  merchantId: "MITRA-DEWI-SANDBOX-001",
};

export const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { id: "va_bca", label: "Virtual Account BCA", icon: "🏦" },
  { id: "va_bni", label: "Virtual Account BNI", icon: "🏦" },
  { id: "va_bri", label: "Virtual Account BRI", icon: "🏦" },
  { id: "va_mandiri", label: "Virtual Account Mandiri", icon: "🏦" },
  { id: "ewallet_gopay", label: "GoPay", icon: "💚" },
  { id: "ewallet_ovo", label: "OVO", icon: "💜" },
  { id: "ewallet_dana", label: "DANA", icon: "🔵" },
  { id: "ewallet_shopeepay", label: "ShopeePay", icon: "🟠" },
  { id: "qris", label: "QRIS", icon: "📱" },
] as const;

export const CANCELLATION_POLICIES: CancellationPolicy[] = [
  {
    id: "free",
    level: "free",
    label: "Free Cancellation",
    refundPercent: 100,
    daysBeforeMin: 7,
  },
  {
    id: "moderate",
    level: "moderate",
    label: "Moderate",
    refundPercent: 50,
    daysBeforeMin: 3,
    daysBeforeMax: 6,
  },
  {
    id: "strict",
    level: "strict",
    label: "Strict",
    refundPercent: 0,
    daysBeforeMax: 2,
  },
];

export const PLATFORM_FEE_RATE: Record<string, number> = {
  accommodation: 0.15,
  sme_order: 0.10,
  experience: 0.15,
  facility_rental: 0.15,
};

// Demo transactions for mock display
export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "txn-001",
    externalId: "EXT-MID-001",
    type: "accommodation",
    referenceId: "res-001",
    amount: 1500000,
    currency: "IDR",
    method: "va_bca",
    status: "success",
    platformFee: 225000,
    platformFeePercent: 15,
    splits: [
      { recipientId: "acc-1", recipientType: "partner", amount: 1275000, percent: 85 },
      { recipientId: "platform", recipientType: "platform", amount: 225000, percent: 15 },
    ],
    metadata: { guestName: "Budi Santoso", nights: 2 },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    paidAt: new Date(Date.now() - 86400000 * 3 + 120000).toISOString(),
  },
  {
    id: "txn-002",
    externalId: "EXT-XEN-002",
    type: "experience",
    referenceId: "exp-res-001",
    amount: 800000,
    currency: "IDR",
    method: "qris",
    status: "success",
    platformFee: 120000,
    platformFeePercent: 15,
    splits: [
      { recipientId: "org-1", recipientType: "partner", amount: 480000, percent: 60 },
      { recipientId: "village-1", recipientType: "village", amount: 200000, percent: 25 },
      { recipientId: "platform", recipientType: "platform", amount: 120000, percent: 15 },
    ],
    metadata: { experienceName: "Festival Panen Raya", tickets: 2 },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    paidAt: new Date(Date.now() - 86400000 * 2 + 60000).toISOString(),
  },
  {
    id: "txn-003",
    externalId: "EXT-DOK-003",
    type: "sme_order",
    referenceId: "ord-001",
    amount: 250000,
    currency: "IDR",
    method: "ewallet_gopay",
    status: "pending",
    platformFee: 25000,
    platformFeePercent: 10,
    splits: [
      { recipientId: "sme-1", recipientType: "partner", amount: 225000, percent: 90 },
      { recipientId: "platform", recipientType: "platform", amount: 25000, percent: 10 },
    ],
    metadata: { productName: "Batik Mega Mendung", quantity: 2 },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const MOCK_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: "ref-001",
    paymentId: "txn-001",
    reason: "Guest cancelled due to emergency",
    type: "partial",
    amount: 750000,
    status: "approved",
    requestedBy: "guest-001",
    processedBy: "admin-001",
    processedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
