export type Locale = "id" | "en" | "ja";

export type PartnerRole =
  | "TRANSPORT"
  | "VILLAGE_ADMIN"
  | "ACCOMMODATION"
  | "UMKM"
  | "EVENT_ORGANIZER";

export type ApprovalStatus = "draft" | "pending" | "approved" | "rejected";

/**
 * Village-level membership approval status.
 * Every SME/Accommodation/Experience must be approved by the Village Admin
 * before they can display under the village name.
 */
export type VillageApprovalStatus =
  | "not_submitted"       // partner has not applied to any village
  | "pending_review"      // application submitted, awaiting village admin decision
  | "approved"            // village admin approved — entity may display village name
  | "rejected"            // village admin rejected the application
  | "revision_requested"; // village admin requested changes before approval

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type RoomStatus = "available" | "booked" | "maintenance";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type WatermarkType = "text" | "image";
export type WatermarkPosition = "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "tiled";

export interface WatermarkConfig {
  enabled: boolean;
  type: WatermarkType;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  imageUrl?: string;
  position: WatermarkPosition;
  padding?: number;
  scale?: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: PartnerRole;
  organizationName: string;
  address: string;
  avatar?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  partnerId: string;
  partnerName: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  roomCode: string;
  type: string;
  description: string;
  bedType: string;
  capacity: number;
  pricePerNight: number;
  sizeSqm: number;
  totalUnits: number;
  availableUnits: number;
  status: RoomStatus;
  floor: string;
  view: string;
  images: string[];
  amenities: string[];
  breakfastIncluded: boolean;
  smokingAllowed: boolean;
  lastCleanedAt?: string;
  maintenanceNote?: string;
  accommodationId: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomName: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  registeredCount: number;
  price: number;
  images: string[];
  organizerId: string;
  organizerName: string;
  status: EventStatus;
  approvalStatus: ApprovalStatus;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  estimatedPickupTime?: string;
  actualPickupTime?: string;
  specialInstructions?: string;
  cancellationReason?: string;
  refundAmount?: number;
  smeId: string;
  smeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "order"
    | "reservation"
    | "approval"
    | "review"
    | "low_stock"
    | "general";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  targetId: string;
  targetType: "product" | "accommodation" | "event";
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
  color: "emerald" | "amber" | "blue" | "rose" | "violet";
}

export type AccommodationSubmissionStatus =
  | "draft"
  | "submitted"
  | "revision"
  | "approved"
  | "suspended";

export type FacilityCategory =
  | "general"
  | "room"
  | "dining"
  | "recreation"
  | "service"
  | "accessibility";

export type DocumentType =
  | "business_license"
  | "tourism_license"
  | "building_permit"
  | "health_certificate"
  | "fire_safety"
  | "environmental_permit"
  | "land_certificate"
  | "tax_id"
  | "other";

export interface AdditionalFee {
  name: string;
  amount: number;
  type: "per_night" | "per_stay" | "per_person" | "percentage";
  isOptional: boolean;
  description?: string;
}

export interface AccommodationImage {
  id: string;
  accommodationId: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  category: "exterior" | "interior" | "room" | "facility" | "surroundings";
  width: number;
  height: number;
  sizeKb: number;
  qualityScore?: number;
  order: number;
}

export interface AccommodationFacility {
  id: string;
  accommodationId: string;
  category: FacilityCategory;
  name: string;
  description?: string;
  isAvailable: boolean;
  availabilityNote?: string;
  icon?: string;
}

export interface AccommodationDocument {
  id: string;
  accommodationId: string;
  type: DocumentType;
  name: string;
  fileUrl: string;
  fileSize: number;
  isVerified: boolean;
  verifiedAt?: string;
  expiryDate?: string;
  notes?: string;
}

export interface Accommodation {
  id: string;
  partnerId: string;
  /** FK → VillageProfile — the village this accommodation belongs to */
  villageId: string;
  /** Denormalized display name (derived from villageId) */
  villageName: string;
  /** Village Admin must approve before accommodation can display under village name */
  villageApprovalStatus: VillageApprovalStatus;
  villageApprovalNote?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  geoTagVerified: boolean;
  images: AccommodationImage[];
  facilities: AccommodationFacility[];
  documents: AccommodationDocument[];
  priceRange: {
    min: number;
    max: number;
    currency: "IDR";
  };
  additionalFees: AdditionalFee[];
  submissionStatus: AccommodationSubmissionStatus;
  rejectionReason?: string;
  rejectionDetails?: string[];
  submittedAt?: string;
  approvedAt?: string;
  reviewedBy?: string;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccommodationSubmissionEvent {
  id: string;
  accommodationId: string;
  status: AccommodationSubmissionStatus;
  title: string;
  description: string;
  rejectionDetails?: string[];
  createdAt: string;
}

export interface PaymentItem {
  id: string;
  paymentId: string;
  type:
    | "room"
    | "additional_fee"
    | "addon_tour"
    | "addon_food"
    | "addon_transport"
    | "addon_other";
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  partnerId: string;
  partnerName: string;
  refundable: boolean;
  refundedAmount?: number;
}

export interface PaymentSplit {
  partnerId: string;
  partnerName: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  settlementStatus: "pending" | "settled" | "failed";
  settledAt?: string;
}

export interface Payment {
  id: string;
  reservationId: string;
  externalId: string;
  method: string;
  status: PaymentStatus;
  currency: "IDR";
  subtotal: number;
  tax: number;
  platformFee: number;
  totalAmount: number;
  items: PaymentItem[];
  splits: PaymentSplit[];
  paidAt?: string;
  expiredAt?: string;
  refundedAmount?: number;
  snapToken?: string;
  snapRedirectUrl?: string;
  webhookPayload?: object;
  createdAt: string;
  updatedAt: string;
}

export type PromotionType =
  | "seasonal_discount"
  | "early_bird"
  | "last_minute"
  | "long_stay"
  | "bundle_package"
  | "promo_code";

export interface Promotion {
  id: string;
  name: string;
  type: PromotionType;
  discountValue: number;
  discountType: "percentage" | "fixed";
  validFrom: string;
  validTo: string;
  applicableRoomIds: string[] | "all";
  applicableAccommodationIds: string[] | "all";
  maxUsage?: number;
  minStay?: number;
  minBookingValue?: number;
  promoCode?: string;
  status: "active" | "inactive" | "expired";
  usageCount: number;
  revenueImpact: number;
}

export interface BankAccount {
  id: string;
  accommodationId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  branch?: string;
  swiftCode?: string;
  isVerified: boolean;
}

export interface WithdrawalRequest {
  id: string;
  accommodationId: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  requestedAt: string;
  paidAt?: string;
}

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

export interface Itinerary {
  time: string;
  endTime?: string;
  activity: string;
  location?: string;
  description?: string;
  isOptional: boolean;
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
  messages: Array<{
    id: string;
    senderRole: "organizer" | "village_admin";
    senderName: string;
    content: string;
    createdAt: string;
  }>;
  facilityRequests: Array<{
    facilityId: string;
    facilityName: string;
    date: string;
    hours: number;
    rentalPrice: number;
  }>;
  revenueSplit: {
    organizer: number;
    village: number;
    platform: number;
  };
  paymentSchedule: Array<{
    milestone: "dp" | "second" | "final";
    percent: number;
    amount: number;
    dueDate: string;
    paid: boolean;
  }>;
  contractRef?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Shared Platform Types ──────────────────────────────────────────────────

export type WithdrawalStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface PartnerBankAccount {
  id: string;
  partnerId: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  branch?: string;
  isVerified: boolean;
  isPrimary: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface PartnerWithdrawalRequest {
  id: string;
  partnerId: string;
  bankAccountId: string;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  failureReason?: string;
  transactionRef?: string;
}

export type OrgAdminRole = "owner" | "admin" | "viewer";

export interface OrganizationAdmin {
  id: string;
  userId: string;
  organizationId: string;
  role: OrgAdminRole;
  permissions: string[];
  invitedBy: string;
  invitedEmail: string;
  status: "active" | "invited" | "deactivated";
  createdAt: string;
}

export interface ReviewResponse {
  text: string;
  respondedBy: string;
  respondedAt: string;
}

export interface EnhancedReview {
  id: string;
  reviewerName: string;
  reviewerEmail?: string;
  targetId: string;
  targetType: "product" | "accommodation" | "experience" | "village" | "sme_store";
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  response?: ReviewResponse;
  isFlagged: boolean;
  flagReason?: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}
