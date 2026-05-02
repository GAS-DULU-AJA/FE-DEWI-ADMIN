import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportPromotionsPage() {
  return (
    <ModulePlaceholderPage
      title="Promo Transport"
      description="Buat dan kelola promo diskon untuk meningkatkan konversi pemesanan."
      highlights={[
        "Kode promo dan diskon periode terbatas.",
        "Aturan minimum order dan kuota promo.",
        "Monitoring performa promo per kanal.",
      ]}
    />
  );
}
