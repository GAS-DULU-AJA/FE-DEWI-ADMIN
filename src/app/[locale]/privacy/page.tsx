import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-20">
        <div className="container mx-auto max-w-3xl px-6 py-12">
          <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900">{t("title")}</h1>
          </div>

          <div className="prose prose-stone max-w-none">
            <p className="text-stone-600 leading-relaxed">{t("intro")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("dataCollection.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("dataCollection.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("dataUsage.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("dataUsage.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("dataSecurity.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("dataSecurity.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("cookies.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("cookies.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("rights.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("rights.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("contact.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("contact.content")}</p>
          </div>

          <p className="mt-10 text-xs text-stone-400">{t("lastUpdated")}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
