import { FACILITIES, PARTNER_APPLICATIONS, VILLAGE_REVIEWS } from "./mock-data";

export function maskBankAccount(accountNumber: string): string {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }
  const visible = accountNumber.slice(-4);
  return `**** **** ${visible}`;
}

export function calculateChecklistProgress(item: {
  checklist: Record<string, boolean>;
}): number {
  const values = Object.values(item.checklist);
  const done = values.filter(Boolean).length;
  return Math.round((done / values.length) * 100);
}

export function getFacilityUtilizationAverage(): number {
  const values = FACILITIES.map((facility) => facility.utilizationRate ?? 0);
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

export function getPartnerApprovalRate(): number {
  const approved = PARTNER_APPLICATIONS.filter((item) => item.status === "approved").length;
  if (PARTNER_APPLICATIONS.length === 0) return 0;
  return Math.round((approved / PARTNER_APPLICATIONS.length) * 100);
}

export function getAverageReviewRating(): number {
  if (VILLAGE_REVIEWS.length === 0) return 0;
  const total = VILLAGE_REVIEWS.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / VILLAGE_REVIEWS.length).toFixed(1));
}
