import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function AccommodationCheckinPage() {
  return (
    <ModulePlaceholderPage
      title="Check-in / Check-out"
      description="Kelola operasional check-in dan check-out tamu harian secara real-time."
      highlights={[
        "Daftar tamu check-in hari ini + aksi cepat mark check-in.",
        "Daftar tamu check-out hari ini untuk koordinasi housekeeping.",
        "Board status kamar dan form walk-in guest.",
      ]}
    />
  );
}
