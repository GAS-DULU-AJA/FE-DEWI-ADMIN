import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function TransportAnalyticsPage() {
  return (
    <ModulePlaceholderPage
      title="Analitik Transport"
      description="Analisis performa operasional, revenue, dan utilisasi armada."
      highlights={[
        "Tren pemesanan harian/mingguan/bulanan.",
        "Utilisasi armada dan efektivitas dispatch supir.",
        "Segmentasi rute paling laris dan profitabilitas.",
      ]}
    />
  );
}
