import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { SME_PRODUCTS } from "@/features/sme/mock-data";
import { getExperienceById, getExperienceCoordinations } from "@/features/experience/utils";
import type { UnifiedProposal } from "./types";

function buildExperienceProposals(): UnifiedProposal[] {
  return getExperienceCoordinations().map((coordination) => {
    const experience = getExperienceById(coordination.experienceId);
    const status =
      coordination.status === "rejected"
        ? "rejected"
        : coordination.status === "changes_requested"
          ? "changes_requested"
          : coordination.status === "approved"
            ? "approved"
            : "under_review";

    return {
      id: `exp-${coordination.id}`,
      module: "EXPERIENCE",
      fromRole: "EVENT_ORGANIZER",
      title: experience?.name ?? coordination.experienceId,
      targetVillage: coordination.targetVillage,
      submittedAt: coordination.createdAt,
      status,
      rejectionReason:
        status === "changes_requested"
          ? "Mohon revisi detail operasional, estimasi peserta, dan catatan mitigasi risiko."
          : undefined,
      timeline: [
        { key: "submitted", date: coordination.createdAt },
        { key: "under_review", date: coordination.updatedAt },
      ],
      sections: [
        {
          titleId: "Informasi Dasar",
          titleEn: "Basic Information",
          rows: [
            { labelId: "Nama", labelEn: "Name", value: experience?.name ?? "-" },
            { labelId: "Kategori", labelEn: "Category", value: experience?.category ?? "-" },
            { labelId: "Deskripsi", labelEn: "Description", value: experience?.description ?? "-" },
            { labelId: "Lokasi", labelEn: "Location", value: `${experience?.locationName ?? "-"} (${experience?.locationAddress ?? "-"})` },
            { labelId: "Jadwal", labelEn: "Schedule", value: `${experience?.scheduleStart ?? "-"} - ${experience?.scheduleEnd ?? "-"}` },
            { labelId: "Kapasitas", labelEn: "Capacity", value: String(experience?.totalCapacity ?? "-") },
          ],
        },
        {
          titleId: "Operasional Event",
          titleEn: "Event Operations",
          rows: [
            { labelId: "PIC", labelEn: "PIC", value: `${experience?.contactPerson ?? "-"} / ${experience?.contactPhone ?? "-"}` },
            { labelId: "Email PIC", labelEn: "PIC Email", value: experience?.contactEmail ?? "-" },
            { labelId: "Kebijakan Pembatalan", labelEn: "Cancellation Policy", value: experience?.cancellationPolicy ?? "-" },
            { labelId: "Persiapan Peserta", labelEn: "What To Bring", value: experience?.whatToBring ?? "-" },
          ],
        },
        {
          titleId: "Tiket, Itinerary, Speaker",
          titleEn: "Tickets, Itinerary, Speakers",
          rows: [
            { labelId: "Tipe Tiket", labelEn: "Ticket Types", value: String(experience?.ticketTypes.length ?? 0) },
            { labelId: "Itinerary", labelEn: "Itinerary Items", value: String(experience?.itinerary.length ?? 0) },
            { labelId: "Speakers", labelEn: "Speakers", value: String(experience?.speakers.length ?? 0) },
            { labelId: "Dokumen", labelEn: "Documents", value: String(experience?.documents.length ?? 0) },
            { labelId: "Notifikasi", labelEn: "Notifications", value: String(experience?.notifications.length ?? 0) },
          ],
        },
        {
          titleId: "Fasilitas & Finansial",
          titleEn: "Facilities & Financial",
          rows: [
            { labelId: "Permintaan Fasilitas", labelEn: "Facility Requests", value: String(coordination.facilityRequests.length) },
            {
              labelId: "Skema Bagi Hasil",
              labelEn: "Revenue Sharing",
              value: `Org ${coordination.revenueSplit.organizer}% · Desa ${coordination.revenueSplit.village}% · Platform ${coordination.revenueSplit.platform}%`,
            },
            { labelId: "Milestone Pembayaran", labelEn: "Payment Milestones", value: String(coordination.paymentSchedule.length) },
          ],
        },
      ],
    };
  });
}

function buildAccommodationProposals(): UnifiedProposal[] {
  return ACCOMMODATIONS.filter((item) => item.submissionStatus === "submitted" || item.submissionStatus === "revision").map((item) => {
    const status = item.submissionStatus === "revision" ? "rejected" : "under_review";

    return {
      id: `acc-${item.id}`,
      module: "ACCOMMODATION",
      fromRole: "ACCOMMODATION",
      title: item.name,
      targetVillage: item.village,
      submittedAt: item.submittedAt ?? item.createdAt,
      status,
      rejectionReason: item.rejectionReason,
      timeline: [
        { key: "submitted", date: item.submittedAt ?? item.createdAt },
        { key: "under_review", date: item.updatedAt },
      ],
      sections: [
        {
          titleId: "Informasi Penginapan",
          titleEn: "Accommodation Information",
          rows: [
            { labelId: "Nama", labelEn: "Name", value: item.name },
            { labelId: "Alamat", labelEn: "Address", value: item.address },
            { labelId: "Desa", labelEn: "Village", value: item.village },
            { labelId: "Deskripsi", labelEn: "Description", value: item.shortDescription },
          ],
        },
        {
          titleId: "Kelengkapan",
          titleEn: "Submission Completeness",
          rows: [
            { labelId: "Dokumen", labelEn: "Documents", value: String(item.documents.length) },
            { labelId: "Foto", labelEn: "Images", value: String(item.images.length) },
            { labelId: "Fasilitas", labelEn: "Facilities", value: String(item.facilities.length) },
            { labelId: "Rentang Harga", labelEn: "Price Range", value: `IDR ${item.priceRange.min} - ${item.priceRange.max}` },
          ],
        },
      ],
    };
  });
}

function buildUmkmProposals(): UnifiedProposal[] {
  return SME_PRODUCTS.filter((item) => item.approvalStatus === "pending").map((item) => ({
    id: `sme-${item.id}`,
    module: "UMKM",
    fromRole: "UMKM",
    title: item.name,
    targetVillage: "Sari Alam",
    submittedAt: item.updatedAt,
    status: "under_review",
    timeline: [
      { key: "submitted", date: item.createdAt },
      { key: "under_review", date: item.updatedAt },
    ],
    sections: [
      {
        titleId: "Informasi Produk",
        titleEn: "Product Information",
        rows: [
          { labelId: "Nama Produk", labelEn: "Product Name", value: item.name },
          { labelId: "Kategori", labelEn: "Category", value: item.category },
          { labelId: "Deskripsi", labelEn: "Description", value: item.description },
          { labelId: "Harga", labelEn: "Price", value: `IDR ${item.price}` },
          { labelId: "Stok", labelEn: "Stock", value: String(item.stock) },
        ],
      },
      {
        titleId: "Operasional UMKM",
        titleEn: "SME Operations",
        rows: [
          { labelId: "Mitra", labelEn: "Partner", value: item.partnerName },
          { labelId: "Minimum Order", labelEn: "Min Order", value: String(item.minOrderQty ?? 1) },
          { labelId: "Maksimum Order", labelEn: "Max Order", value: String(item.maxOrderQty ?? "-") },
          { labelId: "Waktu Siap", labelEn: "Preparation Time", value: `${item.preparationTimeMinutes ?? 0} menit` },
        ],
      },
    ],
  }));
}

export function getVillageInboxProposals(): UnifiedProposal[] {
  return [...buildExperienceProposals(), ...buildAccommodationProposals(), ...buildUmkmProposals()].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function getProposalsForRole(role: "UMKM" | "EVENT_ORGANIZER" | "ACCOMMODATION") {
  return getVillageInboxProposals().filter((item) => item.fromRole === role);
}
