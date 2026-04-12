import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("terms");

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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900">{t("title")}</h1>
          </div>

          <div className="prose prose-stone max-w-none">
            <p className="text-stone-600 leading-relaxed">{t("intro")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("acceptance.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("acceptance.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("accounts.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("accounts.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("partnerObligations.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("partnerObligations.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("payments.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("payments.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("intellectualProperty.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("intellectualProperty.content")}</p>

            <h2 className="text-xl font-semibold text-stone-900 mt-8 mb-3">{t("termination.title")}</h2>
            <p className="text-stone-600 leading-relaxed">{t("termination.content")}</p>

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
