import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/forms/register-form";
import { Leaf } from "lucide-react";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-stone-50 to-amber-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-800">Mitra Dewi</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">{t("registerTitle")}</h1>
          <p className="mt-1 text-stone-500">{t("registerSubtitle")}</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          {tc("appTagline")} &bull; © {new Date().getFullYear()} Mitra Dewi
        </p>
      </div>
    </div>
  );
}
