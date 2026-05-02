import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportFleetPage() {
  return (
    <ModulePlaceholderPage
      title="Manajemen Armada"
      description="Pantau kondisi kendaraan, kapasitas, dan jadwal perawatan armada."
      highlights={[
        "Daftar armada + status aktif/maintenance.",
        "Detail unit kendaraan dan histori perawatan.",
        "Kontrol ketersediaan armada untuk periode booking.",
      ]}
    />
  );
}
