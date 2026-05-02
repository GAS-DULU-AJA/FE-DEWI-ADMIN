import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportDriverPage() {
  return (
    <ModulePlaceholderPage
      title="Manajemen Supir"
      description="Kelola data supir, jadwal kerja, dan performa layanan."
      highlights={[
        "Daftar supir aktif dan status ketersediaan.",
        "Penugasan supir ke booking tertentu.",
        "Ringkasan rating layanan per supir.",
      ]}
    />
  );
}
