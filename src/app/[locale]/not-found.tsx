import { Link } from "@/i18n/navigation";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-surface-container p-5 mb-6">
        <FileQuestion className="h-10 w-10 text-on-surface/40" />
      </div>
      <h1 className="text-3xl font-bold text-on-surface mb-2">404</h1>
      <h2 className="text-lg font-medium text-on-surface/80 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-on-surface/60 max-w-md mb-8">
        Halaman yang Anda cari tidak tersedia. Mungkin telah dipindahkan atau dihapus.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary-gradient px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-colors"
        >
          <Home className="h-4 w-4" />
          Beranda
        </Link>
      </div>
    </div>
  );
}
