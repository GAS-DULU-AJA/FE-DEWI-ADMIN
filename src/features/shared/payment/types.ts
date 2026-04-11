export type PaymentProvider = "midtrans" | "xendit" | "doku";
export type PaymentEnvironment = "sandbox" | "production";
export type TransactionType =
  | "accommodation"
  | "sme_order"
  | "experience"
  | "facility_rental";
export type RefundStatus = "pending" | "approved" | "processed" | "rejected";
export type CancellationPolicyLevel =
  | "free"
  | "moderate"
  | "strict"
  | "custom";

export interface PaymentGatewayConfig {
  provider: PaymentProvider;
  environment: PaymentEnvironment;
  merchantId: string;
}

export interface PaymentSplit {
  recipientId: string;
  recipientType: "partner" | "village" | "platform";
  amount: number;
  percent: number;
}

export interface PaymentTransaction {
  id: string;
  externalId: string;
  type: TransactionType;
  referenceId: string;
  amount: number;
  currency: "IDR";
  method: string;
  status: "pending" | "success" | "failed" | "expired" | "refunded";
  platformFee: number;
  platformFeePercent: number;
  splits: PaymentSplit[];
  metadata: Record<string, unknown>;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
  refundedAmount?: number;
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  reason: string;
  type: "full" | "partial";
  amount: number;
  status: RefundStatus;
  requestedBy: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}

export interface CancellationPolicy {
  id: string;
  level: CancellationPolicyLevel;
  label: string;
  refundPercent: number;
  daysBeforeMin?: number;
  daysBeforeMax?: number;
  partnerId?: string;
}
