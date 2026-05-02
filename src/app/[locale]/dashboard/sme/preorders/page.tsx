import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function SmePreordersPage() {
  return (
    <ModulePlaceholderPage
      title="Pre-Order"
      description="Kelola pesanan terjadwal untuk pengambilan/pengiriman di masa depan."
      highlights={[
        "Tabel pre-order: tanggal ambil, slot, dan status konfirmasi.",
        "Detail pesanan + catatan pelanggan + validasi stok.",
        "Pengaturan cut-off time dan minimum order.",
      ]}
    />
  );
}
