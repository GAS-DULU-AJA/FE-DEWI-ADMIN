import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportDisputesPage() {
  return (
    <ModulePlaceholderPage
      title="Komplain Transport"
      description="Tangani komplain penumpang terkait layanan transportasi wisata desa."
      highlights={[
        "Daftar komplain berdasarkan kategori dan urgensi.",
        "Ruang investigasi insiden per trip.",
        "Workflow resolusi dan eskalasi komplain.",
      ]}
    />
  );
}
