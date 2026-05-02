import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function VillageDisputesPage() {
  return (
    <ModulePlaceholderPage
      title="Komplain & Dispute"
      description="Kelola komplain tamu dan eskalasi penyelesaian untuk layanan desa."
      highlights={[
        "Daftar komplain berdasarkan status: open, in_progress, resolved, escalated.",
        "Timeline kronologi kejadian dan komunikasi pihak terkait.",
        "Aksi respons pengelola desa untuk mediasi cepat.",
      ]}
    />
  );
}
