import { HOMEPAGE_AD_REQUESTS } from "./mock-data";
import type {
  AdvertisementApprovalStatus,
  AdvertisementOwnerRole,
  AdvertisementPlacement,
  HomepageAdvertisementRequest,
} from "./types";

export function getHomepageAdRequests() {
  return HOMEPAGE_AD_REQUESTS;
}

export function getHomepageAdRequestsByRole(role: AdvertisementOwnerRole) {
  return HOMEPAGE_AD_REQUESTS.filter((request) => request.role === role);
}

export function formatAdRole(role: AdvertisementOwnerRole, isId: boolean) {
  const labels: Record<AdvertisementOwnerRole, { id: string; en: string }> = {
    village: { id: "Pengelola Desa", en: "Village Manager" },
    accommodation: { id: "Penginapan", en: "Accommodation" },
    sme: { id: "UMKM", en: "SME" },
    experience: { id: "Experience", en: "Experience" },
    transport: { id: "Transportasi", en: "Transport" },
  };
  return isId ? labels[role].id : labels[role].en;
}

export function formatAdPlacement(placement: AdvertisementPlacement, isId: boolean) {
  const labels: Record<AdvertisementPlacement, { id: string; en: string }> = {
    hero: { id: "Hero Banner", en: "Hero Banner" },
    featured: { id: "Featured Section", en: "Featured Section" },
    sidebar: { id: "Sidebar", en: "Sidebar" },
  };
  return isId ? labels[placement].id : labels[placement].en;
}

export function formatAdStatus(status: AdvertisementApprovalStatus, isId: boolean) {
  const labels: Record<AdvertisementApprovalStatus, { id: string; en: string }> = {
    draft: { id: "Draft", en: "Draft" },
    pending: { id: "Menunggu", en: "Pending" },
    approved: { id: "Disetujui", en: "Approved" },
    rejected: { id: "Ditolak", en: "Rejected" },
  };
  return isId ? labels[status].id : labels[status].en;
}

export function getAdStatusClassName(status: AdvertisementApprovalStatus) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-surface-container text-on-surface/60";
}

export function summarizeAdRequests(requests: HomepageAdvertisementRequest[]) {
  return {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    approved: requests.filter((request) => request.status === "approved").length,
  };
}
