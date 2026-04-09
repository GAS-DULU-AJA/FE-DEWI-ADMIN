import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/forms/login-form";
import { Leaf } from "lucide-react";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-stone-50 to-amber-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-900 via-emerald-800 to-stone-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold">Mitra Dewi</div>
            <div className="text-xs text-emerald-300">{tc("appTagline")}</div>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">
            Kelola Bisnis Desa Wisata Anda dengan Mudah
          </h2>
          <p className="mt-4 text-emerald-200/80 leading-relaxed">
            Bergabunglah dengan ratusan mitra desa wisata di seluruh Indonesia dalam satu platform digital yang terpadu.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "120+", label: "Mitra Aktif" },
              { value: "5K+", label: "Wisatawan" },
              { value: "350+", label: "Produk" },
              { value: "12", label: "Desa Wisata" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 p-4">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-emerald-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-emerald-400/60">
          © 2025 Mitra Dewi. Platform Digital Desa Wisata Indonesia.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-emerald-800">Mitra Dewi</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900">{t("loginTitle")}</h1>
            <p className="mt-1 text-stone-500">{t("loginSubtitle")}</p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs font-semibold text-amber-800 mb-1">Demo Akun:</p>
            <div className="text-xs text-amber-700 space-y-0.5">
              <div>🏘️ <strong>admin@desawisata.id</strong> — Pengelola Desa</div>
              <div>🏨 <strong>hotel@dewi.id</strong> — Penginapan</div>
              <div>🛍️ <strong>umkm@dewi.id</strong> — UMKM</div>
              <div>🎪 <strong>event@dewi.id</strong> — Event Organizer</div>
              <div className="mt-1">Password semua: <strong>password123</strong></div>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
