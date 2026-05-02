import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function ExperienceDisputesPage() {
  return (
    <ModulePlaceholderPage
      title="Dispute Experience"
      description="Kelola isu peserta event seperti refund, no-show, dan perubahan jadwal."
      highlights={[
        "Daftar dispute terkait tiket dan kehadiran peserta.",
        "Timeline keputusan refund dan approval internal.",
        "Riwayat komunikasi dengan peserta tersimpan rapi.",
      ]}
    />
  );
}
