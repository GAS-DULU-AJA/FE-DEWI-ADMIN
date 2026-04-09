export type Locale = "id" | "en" | "ja";

export type PartnerRole =
  | "VILLAGE_ADMIN"
  | "ACCOMMODATION"
  | "UMKM"
  | "EVENT_ORGANIZER";

export type ApprovalStatus = "draft" | "pending" | "approved" | "rejected";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type RoomStatus = "available" | "booked" | "maintenance";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

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

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  createdAt: string;
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
