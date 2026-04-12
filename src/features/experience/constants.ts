import type { EventDocumentType, EventLocationType, EventVisibility, ExperienceCategory, NotificationType } from "./types";

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  "cultural",
  "nature",
  "culinary",
  "craft",
  "adventure",
  "wellness",
  "education",
  "festival",
  "photography",
  "agro_tourism",
  "other",
];

export const EVENT_VISIBILITIES: EventVisibility[] = ["public", "private", "invite_only"];
export const EVENT_LOCATION_TYPES: EventLocationType[] = ["offline", "online", "hybrid"];
export const EVENT_DOCUMENT_TYPES: EventDocumentType[] = ["contract", "rundown", "permit", "invoice", "other"];
export const NOTIFICATION_TYPES: NotificationType[] = ["reminder", "update", "cancellation", "promotion", "check_in"];

export const DEFAULT_REVENUE_SPLIT = {
  organizer: 60,
  village: 25,
  platform: 15,
};

export const REVENUE_SPLIT_LIMITS = {
  organizer: { min: 50, max: 70 },
  village: { min: 15, max: 35 },
  platform: { min: 15, max: 15 },
};

export const DEFAULT_PAYMENT_SCHEME = [
  { milestone: "dp", percent: 30 },
  { milestone: "second", percent: 40 },
  { milestone: "final", percent: 30 },
] as const;

export const FACILITY_COLORS = {
  available: "bg-emerald-100 text-emerald-700",
  limited: "bg-amber-100 text-amber-700",
  unavailable: "bg-red-100 text-red-700",
};

export const DIFFICULTY_LEVELS = ["easy", "moderate", "challenging"] as const;
export const REFUND_POLICIES = ["full", "partial", "non_refundable"] as const;
