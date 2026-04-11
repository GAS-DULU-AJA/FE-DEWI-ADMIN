import type { PaymentStatus } from "@/types";

export type ExperienceCategory =
  | "cultural"
  | "nature"
  | "culinary"
  | "craft"
  | "adventure"
  | "wellness"
  | "education"
  | "festival"
  | "photography"
  | "agro_tourism"
  | "other";

export type ExperienceLifecycleStatus =
  | "draft"
  | "proposal_sent"
  | "under_review"
  | "changes_requested"
  | "village_approved"
  | "published"
  | "ticket_sales_open"
  | "ongoing"
  | "completed"
  | "rejected"
  | "cancelled"
  | "refund_processing"
  | "closed";

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quota: number;
  sold: number;
  perPersonPrice: boolean;
  groupSize?: number;
  includes: string[];
  minAge?: number;
  maxAge?: number;
}

export interface ItineraryItem {
  time: string;
  endTime?: string;
  activity: string;
  location?: string;
  description?: string;
  isOptional: boolean;
}

export interface ExperienceItem {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ExperienceCategory;
  locationName: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  targetVillage: string;
  scheduleStart: string;
  scheduleEnd: string;
  isMultiDay: boolean;
  recurringPattern?: "one-time" | "daily" | "weekly" | "monthly";
  totalCapacity: number;
  ticketTypes: TicketType[];
  media: string[];
  posterImage: string;
  videoUrl?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  cancellationPolicy: string;
  whatToBring?: string;
  minAge?: number;
  maxAge?: number;
  difficultyLevel?: "easy" | "moderate" | "challenging";
  languages?: string[];
  insuranceIncluded?: boolean;
  itinerary: ItineraryItem[];
  facilitiesNeeded?: string[];
  status: ExperienceLifecycleStatus;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  monthlyRevenue: number;
}

export interface ExperienceReservation {
  id: string;
  experienceId: string;
  experienceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  bookingStatus: "confirmed" | "checked_in" | "no_show" | "cancelled";
  isWaitlist: boolean;
  groupSize?: number;
  specialRequirements?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface CoordinationMessage {
  id: string;
  senderRole: "organizer" | "village_admin";
  senderName: string;
  content: string;
  createdAt: string;
}

export interface FacilityRequest {
  facilityId: string;
  facilityName: string;
  date: string;
  hours: number;
  rentalPrice: number;
}

export interface RevenueSplit {
  organizer: number;
  village: number;
  platform: number;
}

export interface PaymentMilestone {
  milestone: "dp" | "second" | "final";
  percent: number;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface ExperienceCoordination {
  id: string;
  experienceId: string;
  targetVillage: string;
  status:
    | "proposal_sent"
    | "under_review"
    | "changes_requested"
    | "facility_reserved"
    | "terms_agreed"
    | "approved"
    | "rejected"
    | "completed";
  messages: CoordinationMessage[];
  facilityRequests: FacilityRequest[];
  revenueSplit: RevenueSplit;
  paymentSchedule: PaymentMilestone[];
  contractRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperiencePromotion {
  id: string;
  experienceId: string;
  name: string;
  type:
    | "early_bird"
    | "group_discount"
    | "last_chance"
    | "returning_customer"
    | "promo_code"
    | "bundle";
  discountType: "percentage" | "fixed";
  discountValue: number;
  promoCode?: string;
  validFrom: string;
  validTo: string;
  status: "active" | "inactive";
}

export interface ExperienceReview {
  id: string;
  experienceId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  organizerResponse?: string;
}
