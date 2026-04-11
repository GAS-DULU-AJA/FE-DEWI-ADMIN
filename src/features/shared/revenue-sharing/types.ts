export type SettlementSpeed = "standard" | "express" | "instant";

export interface RevenueShareConfig {
  id: string;
  transactionType: string;
  partnerPercent: number;
  villagePercent: number;
  platformPercent: number;
  isNegotiable: boolean;
  minPartnerPercent: number;
  maxPartnerPercent: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface SettlementSchedule {
  speed: SettlementSpeed;
  label: string;
  daysToSettle: number;
  feePercent: number;
  description: string;
}
