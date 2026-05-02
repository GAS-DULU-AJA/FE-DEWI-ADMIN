import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function SmeHoursPage() {
  return (
    <ModulePlaceholderPage
      title="Jam Operasional"
      description="Atur jam buka harian, hari libur, dan jam khusus untuk toko/warung."
      highlights={[
        "Toggle buka/tutup per hari dengan rentang waktu.",
        "Daftar tanggal libur khusus (holiday override).",
        "Jam operasional spesial untuk event atau hari besar.",
      ]}
    />
  );
}
