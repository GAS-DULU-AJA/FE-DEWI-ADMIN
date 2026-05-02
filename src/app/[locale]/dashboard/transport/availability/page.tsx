import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportAvailabilityPage() {
  return (
    <ModulePlaceholderPage
      title="Kalender Ketersediaan"
      description="Lihat ketersediaan armada dan supir dalam tampilan kalender operasional."
      highlights={[
        "Kalender booking kendaraan per hari.",
        "Slot kosong vs slot terisi untuk perencanaan dispatch.",
        "Blok tanggal maintenance armada.",
      ]}
    />
  );
}
