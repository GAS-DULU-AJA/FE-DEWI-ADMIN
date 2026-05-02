import { ModulePlaceholderPage } from "@/features/shared/components/module-placeholder-page";

export default function NotificationsPage() {
  return (
    <ModulePlaceholderPage
      title="Pusat Notifikasi"
      description="Pantau seluruh notifikasi penting lintas modul dalam satu halaman."
      highlights={[
        "Filter notifikasi: unread, system, transaksi, promosi.",
        "Aksi massal: Tandai dibaca / arsipkan.",
        "Panel detail untuk melihat konteks notifikasi.",
      ]}
    />
  );
}
