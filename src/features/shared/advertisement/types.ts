export type AdvertisementOwnerRole = "village" | "accommodation" | "sme" | "experience" | "transport";

export type AdvertisementPlacement = "hero" | "featured" | "sidebar";

export type AdvertisementApprovalStatus = "draft" | "pending" | "approved" | "rejected";

export interface HomepageAdvertisementRequest {
  id: string;
  role: AdvertisementOwnerRole;
  campaignName: string;
  placement: AdvertisementPlacement;
  requestedBy: string;
  requestedAt: string;
  status: AdvertisementApprovalStatus;
  note?: string;
}
