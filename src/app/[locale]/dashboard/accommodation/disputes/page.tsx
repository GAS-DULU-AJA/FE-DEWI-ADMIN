import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function AccommodationDisputesPage() {
  return (
    <ModulePlaceholderPage
      title="Komplain Tamu"
      description="Pantau dan selesaikan komplain terkait reservasi dan layanan penginapan."
      highlights={[
        "Filter komplain berdasar properti dan tingkat prioritas.",
        "Panel detail komplain + evidence + catatan internal.",
        "Workflow respons: klarifikasi, solusi, penutupan kasus.",
      ]}
    />
  );
}
