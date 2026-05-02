import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function AccommodationCancellationsPage() {
  return (
    <ModulePlaceholderPage
      title="Pembatalan Reservasi"
      description="Kelola pembatalan dan proses refund reservasi penginapan secara terstruktur."
      highlights={[
        "Tabel pembatalan dengan filter pending_refund, refunded, no_refund.",
        "Panel aksi refund: approve/reject + nominal refund.",
        "Riwayat alasan pembatalan untuk evaluasi operasional.",
      ]}
    />
  );
}
