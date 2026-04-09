import type { PartnerRole } from "@/types";

export const LOCALES = ["id", "en", "ja"] as const;
export const DEFAULT_LOCALE = "id";

export const LOCALE_LABELS: Record<string, string> = {
  id: "🇮🇩 Indonesia",
  en: "🇬🇧 English",
  ja: "🇯🇵 日本語",
};

export const PARTNER_ROLES: PartnerRole[] = [
  "VILLAGE_ADMIN",
  "ACCOMMODATION",
  "UMKM",
  "EVENT_ORGANIZER",
];

export const ROLE_DASHBOARD_PATH: Record<PartnerRole, string> = {
  VILLAGE_ADMIN: "/dashboard/pengelola-desa",
  ACCOMMODATION: "/dashboard/penginapan",
  UMKM: "/dashboard/umkm",
  EVENT_ORGANIZER: "/dashboard/event-organizer",
};

export const ROLE_COLORS: Record<PartnerRole, string> = {
  VILLAGE_ADMIN: "emerald",
  ACCOMMODATION: "blue",
  UMKM: "amber",
  EVENT_ORGANIZER: "violet",
};

export const APPROVAL_STATUS_COLORS = {
  draft: "bg-stone-100 text-stone-700",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export const RESERVATION_STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  checked_in: "bg-emerald-100 text-emerald-700",
  checked_out: "bg-stone-100 text-stone-700",
  cancelled: "bg-red-100 text-red-700",
};

export const DEMO_USERS = [
  {
    id: "1",
    email: "admin@desawisata.id",
    password: "password123",
    role: "VILLAGE_ADMIN" as PartnerRole,
    fullName: "Budi Santoso",
    organizationName: "Desa Wisata Sari Alam",
    phone: "081234567890",
    address: "Jl. Desa Wisata No. 1, Yogyakarta",
    isApproved: true,
    avatar: "",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    email: "hotel@dewi.id",
    password: "password123",
    role: "ACCOMMODATION" as PartnerRole,
    fullName: "Sari Indah",
    organizationName: "Homestay Bukit Hijau",
    phone: "082345678901",
    address: "Jl. Bukit Hijau No. 5, Yogyakarta",
    isApproved: true,
    avatar: "",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    email: "umkm@dewi.id",
    password: "password123",
    role: "UMKM" as PartnerRole,
    fullName: "Rini Wulandari",
    organizationName: "Batik Nusantara",
    phone: "083456789012",
    address: "Jl. Kerajinan No. 12, Yogyakarta",
    isApproved: true,
    avatar: "",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    email: "event@dewi.id",
    password: "password123",
    role: "EVENT_ORGANIZER" as PartnerRole,
    fullName: "Agus Hermawan",
    organizationName: "Nusantara Events",
    phone: "084567890123",
    address: "Jl. Budaya No. 8, Yogyakarta",
    isApproved: true,
    avatar: "",
    createdAt: "2024-02-15",
  },
];
