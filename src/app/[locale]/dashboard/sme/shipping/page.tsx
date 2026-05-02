import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function SmeShippingPage() {
  return (
    <ModulePlaceholderPage
      title="Pengiriman Suvenir"
      description="Kelola pengiriman order suvenir termasuk resi, kurir, dan update tracking."
      highlights={[
        "Daftar order siap kirim dengan nomor resi dan kurir.",
        "Konfigurasi area pengiriman dan tarif ongkir.",
        "Panel update status tracking manual.",
      ]}
    />
  );
}
