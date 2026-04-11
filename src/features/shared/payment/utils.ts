import type { PaymentTransaction, RefundRequest } from "./types";
import { PLATFORM_FEE_RATE } from "./constants";

/**
 * Simulates payment processing — resolves after a brief delay (mock).
 * In production, this would call a payment gateway API.
 */
export async function mockProcessPayment(
  transactionId: string,
  _amount: number
): Promise<{ success: boolean; externalId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true, externalId: `EXT-MOCK-${transactionId}` };
}

/**
 * Calculate splits for a given transaction amount.
 */
export function calculateSplits(
  amount: number,
  type: PaymentTransaction["type"],
  isExternalExperience = false
) {
  const platformPercent = PLATFORM_FEE_RATE[type] ?? 0.15;
  const platformFee = Math.round(amount * platformPercent);

  if (type === "experience" && isExternalExperience) {
    const villagePercent = 0.25;
    const partnerPercent = 1 - platformPercent - villagePercent;
    return {
      platformFee,
      platformFeePercent: platformPercent * 100,
      splits: [
        {
          recipientId: "partner",
          recipientType: "partner" as const,
          amount: Math.round(amount * partnerPercent),
          percent: partnerPercent * 100,
        },
        {
          recipientId: "village",
          recipientType: "village" as const,
          amount: Math.round(amount * villagePercent),
          percent: villagePercent * 100,
        },
        {
          recipientId: "platform",
          recipientType: "platform" as const,
          amount: platformFee,
          percent: platformPercent * 100,
        },
      ],
    };
  }

  const partnerPercent = 1 - platformPercent;
  return {
    platformFee,
    platformFeePercent: platformPercent * 100,
    splits: [
      {
        recipientId: "partner",
        recipientType: "partner" as const,
        amount: Math.round(amount * partnerPercent),
        percent: partnerPercent * 100,
      },
      {
        recipientId: "platform",
        recipientType: "platform" as const,
        amount: platformFee,
        percent: platformPercent * 100,
      },
    ],
  };
}

/**
 * Calculate refund amount based on cancellation policy and original amount.
 */
export function calculateRefundAmount(
  originalAmount: number,
  refundPercent: number
): number {
  return Math.round(originalAmount * (refundPercent / 100));
}

/**
 * Build a mock RefundRequest from a payment.
 */
export function buildRefundRequest(
  payment: PaymentTransaction,
  reason: string,
  type: RefundRequest["type"],
  refundPercent: number
): RefundRequest {
  return {
    id: `ref-${Date.now()}`,
    paymentId: payment.id,
    reason,
    type,
    amount: calculateRefundAmount(payment.amount, refundPercent),
    status: "pending",
    requestedBy: "current-user",
    createdAt: new Date().toISOString(),
  };
}
