import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function VillageBundlesPage() {
  return (
    <ModulePlaceholderPage
      title="Paket Bundling"
      description="Susun paket wisata gabungan experience, akomodasi, dan kuliner untuk upsell desa."
      highlights={[
        "Daftar paket bundling aktif beserta komposisi item.",
        "Konfigurasi harga bundling vs harga satuan.",
        "Kontrol diskon paket dan periode berlaku.",
      ]}
    />
  );
}
