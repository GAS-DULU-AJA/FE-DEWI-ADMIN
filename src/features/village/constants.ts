import type { CoordinationStatus, ExperienceStatus, FacilityCategory, PartnerApplicationStatus } from "./types";

export const FACILITY_CATEGORY_LABELS: Record<FacilityCategory, string> = {
  public: "Public",
  security: "Security",
  transportation: "Transportation",
  monetizable: "Monetizable",
};

export const EXPERIENCE_STATUS_LABELS: Record<ExperienceStatus, string> = {
  draft: "Draft",
  published: "Published",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PARTNER_STATUS_LABELS: Record<PartnerApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  revision_required: "Revision Required",
  rejected: "Rejected",
};

export const COORDINATION_STATUS_LABELS: Record<CoordinationStatus, string> = {
  application: "Application",
  under_review: "Under Review",
  facility_reserved: "Facility Reserved",
  terms_agreed: "Terms Agreed",
  active: "Active",
  completed: "Completed",
  rejected: "Rejected",
};

export const DEFAULT_REVENUE_SHARING = {
  organizer: 60,
  village: 25,
  platform: 15,
};

export const DEFAULT_PAYMENT_SCHEME = [
  { milestone: "Down Payment", percent: 30, timing: "Upon approval" },
  { milestone: "Second Payment", percent: 40, timing: "7 days before event" },
  { milestone: "Final Payment", percent: 30, timing: "Day of event" },
];
