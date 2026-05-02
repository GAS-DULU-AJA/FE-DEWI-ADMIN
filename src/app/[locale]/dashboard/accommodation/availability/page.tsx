import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function AccommodationAvailabilityPage() {
  return (
    <ModulePlaceholderPage
      title="Kalender Ketersediaan"
      description="Visualisasi ketersediaan kamar per tanggal untuk kontrol okupansi harian."
      highlights={[
        "Grid bulanan status kamar: available, partial, full, maintenance.",
        "Legend warna untuk status ketersediaan.",
        "Editor massal blok tanggal dan harga khusus periode tertentu.",
      ]}
    />
  );
}
