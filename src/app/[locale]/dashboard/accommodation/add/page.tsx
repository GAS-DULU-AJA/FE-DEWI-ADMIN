import { AccommodationPageHeader, AccommodationWizard } from "@/features/accommodation";

export default function TambahPenginapanPage() {
  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Ajukan Penginapan Baru"
        description="Lengkapi semua langkah pengajuan. Pengajuan akan diverifikasi admin sebelum dipublikasikan."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: "Ajukan Baru" },
        ]}
        backHref="/dashboard/accommodation"
      />

      <AccommodationWizard />
    </div>
  );
}
