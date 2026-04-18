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
  organizationName: string;
  role: "accommodation" | "sme" | "external_experience";
  ownerName: string;
  submittedAt: string;
  status: PartnerApplicationStatus;
  completionScore: number;
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
