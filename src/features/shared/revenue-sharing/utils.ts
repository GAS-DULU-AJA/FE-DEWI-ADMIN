import type { RevenueShareConfig } from "./types";

/**
 * Get the revenue share config for a given transaction type.
 * Falls back to external experience config if no exact match.
 */
export function getRevenueConfig(
  configs: RevenueShareConfig[],
  transactionType: string
): RevenueShareConfig | undefined {
  return configs.find((c) => c.transactionType === transactionType);
}

/**
 * Calculate the settlement date given a speed preference.
 */
export function getSettlementDate(
  transactionDate: string,
  daysToSettle: number
): string {
  const d = new Date(transactionDate);
  d.setDate(d.getDate() + daysToSettle);
  return d.toISOString().split("T")[0];
}

/**
 * Calculate each party's amount given the revenue config and gross amount.
 */
export function splitRevenue(
  grossAmount: number,
  config: RevenueShareConfig
): { partnerAmount: number; villageAmount: number; platformAmount: number } {
  return {
    partnerAmount: Math.round(grossAmount * (config.partnerPercent / 100)),
    villageAmount: Math.round(grossAmount * (config.villagePercent / 100)),
    platformAmount: Math.round(grossAmount * (config.platformPercent / 100)),
  };
}
