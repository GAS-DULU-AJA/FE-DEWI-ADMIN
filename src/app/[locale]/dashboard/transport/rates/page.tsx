import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportRatesPage() {
  return (
    <ModulePlaceholderPage
      title="Tarif & Harga"
      description="Atur struktur harga transport berdasarkan jenis armada dan durasi layanan."
      highlights={[
        "Harga dasar per layanan dan tipe kendaraan.",
        "Konfigurasi surcharge: peak season, jarak, dan overtime.",
        "Aturan diskon promo untuk periode tertentu.",
      ]}
    />
  );
}
