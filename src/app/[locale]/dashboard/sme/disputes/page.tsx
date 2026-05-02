import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function SmeDisputesPage() {
  return (
    <ModulePlaceholderPage
      title="Komplain Pelanggan"
      description="Tangani komplain pelanggan untuk order kuliner maupun suvenir."
      highlights={[
        "Daftar komplain terkait kualitas produk, pengiriman, atau keterlambatan.",
        "Template respons cepat untuk tim operasional.",
        "Pelacakan SLA penyelesaian tiap komplain.",
      ]}
    />
  );
}
