import type { VillageApprovalStatus } from "@/types";

export type FacilityCategory =
  | "public"
  | "security"
  | "transportation"
  | "monetizable";

export type ExperienceCategory =
  | "cultural"
  | "nature"
  | "culinary"
  | "craft"
  | "sport"
  | "education"
  | "other";

export type ExperienceStatus =
  | "draft"
  | "published"
  | "ongoing"
  | "completed"
  | "cancelled";

export type PartnerApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "revision_required"
  | "rejected";

export type CoordinationStatus =
  | "application"
  | "under_review"
  | "facility_reserved"
  | "terms_agreed"
  | "active"
  | "completed"
  | "rejected";

export type FacilityReservationStatus = "pending" | "approved" | "rejected" | "completed";

// ─── Contact & Social Media Types ───────────────────────────

export type ContactType = "phone" | "email" | "whatsapp" | "fax" | "hotline" | "other";

export interface VillageContact {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  isPrimary: boolean;
  sortOrder: number;
}

export type SocialMediaPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "website"
  | "other";

export interface VillageSocialMedia {
  id: string;
  platform: SocialMediaPlatform;
  label?: string;
  url: string;
  username?: string;
  sortOrder: number;
}

// ─── Profile Section Types ──────────────────────────────────

export type ProfileSectionType =
  | "history"
  | "vision_mission"
  | "culture"
  | "geography"
  | "custom";

export interface ProfileSection {
  id: string;
  type: ProfileSectionType;
  title?: string;
  content: Record<string, any>;
  sortOrder: number;
  isVisible: boolean;
}

// ─── Tag Types ──────────────────────────────────────────────

export type VillageTagCategory = "theme" | "attraction" | "certification" | "custom";

export interface VillageTag {
  id: string;
  name: string;
  category: VillageTagCategory;
  icon?: string;
  isActive: boolean;
}

export interface VillageTagAssignment {
  id: string;
  tagId: string;
  tag: VillageTag;
  assignedAt: string;
}

// ─── Government Service Types ───────────────────────────────

export type GovernmentServiceType =
  | "clinic"
  | "hospital"
  | "fire_department"
  | "police"
  | "pharmacy"
  | "other";

export type GovernmentServicePriority = "open_24h" | "emergency_ready";

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface DaySchedule {
  enabled: boolean;
  is24Hours: boolean;
  openTime?: string;
  closeTime?: string;
}

export type OperatingHoursSchedule = Record<DayOfWeek, DaySchedule>;

export interface GovernmentServiceFacility {
  id: string;
  type: GovernmentServiceType;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  operatingHours?: string | OperatingHoursSchedule;
  notes?: string;
  priorities?: GovernmentServicePriority[];
}

export interface VillageHighlightedAttraction {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

export interface VillageBookingInfo {
  duration: string;
  groupSize: string;
  includes: string[];
  startingPrice?: number;
}

export interface VillageProfile {
  villageName: string;
  address: string;
  latitude: number;
  longitude: number;
  history: string;
  description: string;
  // Flexible contacts (replaces static contactPhone/contactEmail/website)
  contacts: VillageContact[];
  // Flexible social media (replaces static socialMedia object)
  socialMediaLinks: VillageSocialMedia[];
  // Profile sections for storytelling
  profileSections: ProfileSection[];
  // Tags
  tags: VillageTagAssignment[];
  // Homepage curation flags
  isFeatured?: boolean;
  isPopular?: boolean;
  // Highlighted attractions shown on destination detail page
  highlightedAttractions?: VillageHighlightedAttraction[];
  // Booking / package info shown on destination detail sidebar
  bookingInfo?: VillageBookingInfo;
  // Legacy fields kept for backward compat
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  coverPhoto?: string;
  gallery?: string[];
  videoUrl?: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  taxId?: string;
  governmentServices?: GovernmentServiceFacility[];
}

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: string;
  contact?: string;
  photos: string[];
  isMonetizable: boolean;
  rentalPrice?: number;
  capacity?: number;
  utilizationRate?: number;
}

export interface Experience {
  id: string;
  name: string;
  description: string;
  category: ExperienceCategory;
  location: string;
  latitude?: number;
  longitude?: number;
  startsAt: string;
  endsAt: string;
  recurringPattern?: "one-time" | "daily" | "weekly" | "monthly";
  capacity: number;
  booked: number;
  pricePerPerson: number;
  status: ExperienceStatus;
  contactPerson: string;
  cancellationPolicy: string;
  facilitiesUsed: string[];
}

export interface PartnerApplication {
  id: string;
  /** FK → VillageProfile.id — the village this partner is applying to */
  villageId: string;
  /** Denormalized village display name */
  villageName: string;
  /** Whether the Village Admin has approved this partner as an official village member */
  villageApprovalStatus: VillageApprovalStatus;
  /** Optional note from Village Admin (e.g. reason for rejection/revision) */
  villageApprovalNote?: string;
  /** Timestamp when village admin approved */
  villageApprovedAt?: string;
  organizationName: string;
  role: "accommodation" | "sme" | "external_experience";
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessType?: string;
  description?: string;
  address?: string;
  submittedAt: string;
  status: PartnerApplicationStatus;
  completionScore: number;
  documents?: {
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    googleMapsUrl?: string;
  };
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  media?: {
    type: "photo" | "video";
    title: string;
    fileUrl: string;
    thumbnailUrl?: string;
    uploadedAt: string;
  }[];
  activityLog?: {
    id: string;
    status: PartnerApplicationStatus;
    note: string;
    createdAt: string;
  }[];
  partnerStatus?: "active" | "pending" | "suspended";
  checklist: {
    businessInfo: boolean;
    documents: boolean;
    location: boolean;
    financial: boolean;
    media: boolean;
  };
  latestNote?: string;
}

export interface CoordinationRequest {
  id: string;
  organizerName: string;
  eventName: string;
  requestedFacilityId?: string;
  requestedDate: string;
  participantsEstimate: number;
  status: CoordinationStatus;
  villageSharePercent: number;
  organizerSharePercent: number;
  platformSharePercent: number;
}

export interface VillageReview {
  id: string;
  entityType: "experience" | "facility" | "general";
  targetName: string;
  rating: number;
  reviewerName: string;
  comment: string;
  createdAt: string;
  hasResponse: boolean;
}

export interface VillageDashboardKpi {
  totalPartners: number;
  pendingApprovals: number;
  activeExperiences: number;
  monthlyRevenue: number;
  facilityUtilizationRate: number;
  averageVillageRating: number;
}

export interface FacilityReservation {
  id: string;
  facilityId: string;
  facilityName: string;
  requesterName: string;
  requesterRole: "organizer" | "community" | "government" | "internal";
  startDate: string;
  endDate: string;
  participants: number;
  purpose: string;
  status: FacilityReservationStatus;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  isPinned: boolean;
  createdAt: string;
}

// ─── Facility Invoice ────────────────────────────────────────

export type InvoiceStatus = "pending_payment" | "paid" | "cancelled" | "overdue";

export interface FacilityInvoiceItem {
  facilityId: string;
  facilityName: string;
  rentalPrice: number;
  durationDays: number;
  subtotal: number;
}

export interface FacilityInvoice {
  id: string;
  coordinationRequestId: string;
  eventName: string;
  organizerName: string;
  eventDate: string;
  issuedAt: string;
  dueDate: string;
  status: InvoiceStatus;
  items: FacilityInvoiceItem[];
  totalAmount: number;
  paidAt?: string;
  paymentMethod?: string;
  invoiceNumber: string;
}

// ─── Village Balance ─────────────────────────────────────────

export type BalanceTransactionType =
  | "facility_rental"
  | "revenue_share"
  | "withdrawal"
  | "refund";

export interface BalanceTransaction {
  id: string;
  type: BalanceTransactionType;
  description: string;
  amount: number; // positive = credit, negative = debit
  balanceAfter: number;
  referenceId?: string;
  createdAt: string;
}

export interface VillageBalance {
  currentBalance: number;
  totalEarnedAllTime: number;
  pendingIncoming: number;
  totalWithdrawn: number;
  lastUpdatedAt: string;
}

// ─── Visitor Analytics ───────────────────────────────────────

export interface MonthlyVisitorData {
  month: string; // "Jan", "Feb", etc.
  domestic: number;
  international: number;
}

export interface VisitorDemographic {
  city: string;
  province: string;
  count: number;
  percentage: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  type: "experience" | "accommodation" | "sme";
  revenue: number;
  bookings: number;
  rating: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

export interface VisitorStats {
  totalThisMonth: number;
  totalThisYear: number;
  domesticPercent: number;
  internationalPercent: number;
  avgDurationDays: number;
  repeatVisitorPercent: number;
  monthlyTrend: MonthlyVisitorData[];
  demographics: VisitorDemographic[];
}

// ─── Commission & Fee Config ─────────────────────────────────

export interface CommissionConfig {
  commissionPercent: number; // 5–15% dari setiap transaksi
  convenienceFeeFlat: number; // Rp per transaksi
  splitOrganizer: number;
  splitVillage: number;
  splitPlatform: number;
}

// ─── Subscription Tier ───────────────────────────────────────

export type SubscriptionTierName = "free" | "pro" | "government";

export interface SubscriptionTierFeature {
  label: string;
  included: boolean;
}

export interface SubscriptionTier {
  name: SubscriptionTierName;
  monthlyPrice: number; // 0 for free
  commissionDiscount: number; // reduction in commission %
  features: SubscriptionTierFeature[];
}

export interface PartnerSubscription {
  partnerId: string;
  currentTier: SubscriptionTierName;
  renewsAt?: string;
  activatedAt: string;
}

// ─── Document Verification ───────────────────────────────────

export type LegalDocStatus = "not_uploaded" | "pending_review" | "verified" | "rejected";

export interface LegalDocument {
  id: string;
  type: "sk_kepala_desa" | "sk_bupati" | "akta_bumdes" | "npwp" | "other";
  label: string;
  fileUrl?: string;
  uploadedAt?: string;
  status: LegalDocStatus;
  reviewNote?: string;
}

export interface DocumentVerificationState {
  isTransactionEnabled: boolean;
  overallStatus: LegalDocStatus;
  documents: LegalDocument[];
}
