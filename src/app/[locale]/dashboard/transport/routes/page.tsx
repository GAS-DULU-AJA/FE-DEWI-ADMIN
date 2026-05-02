import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportRoutesPage() {
  return (
    <ModulePlaceholderPage
      title="Paket Rute"
      description="Kelola paket rute populer dan harga bundling untuk wisatawan."
      highlights={[
        "Daftar rute reguler dan paket custom.",
        "Estimasi durasi, jarak, dan biaya per rute.",
        "Status aktif/nonaktif untuk publikasi rute.",
      ]}
    />
  );
}
