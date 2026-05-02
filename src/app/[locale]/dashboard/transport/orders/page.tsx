import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportOrdersPage() {
  return (
    <ModulePlaceholderPage
      title="Pemesanan Transport"
      description="Kelola pemesanan masuk, konfirmasi, dan penugasan armada."
      highlights={[
        "Daftar pemesanan terbaru dengan status realtime.",
        "Aksi cepat konfirmasi / tolak pesanan.",
        "Assignment supir dan kendaraan untuk tiap booking.",
      ]}
    />
  );
}
