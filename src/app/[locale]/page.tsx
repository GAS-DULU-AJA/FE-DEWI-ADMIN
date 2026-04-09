import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Globe,
  LayoutDashboard,
  CheckSquare,
  Building2,
  ShoppingBag,
  CalendarDays,
  BedDouble,
  ArrowRight,
  Star,
  Users,
  MapPin,
  Trophy,
} from "lucide-react";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tp = await getTranslations({ locale, namespace: "partner" });

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      color: "bg-violet-100 text-violet-700",
    },
  ];

  const stats = [
    { value: "120+", label: t("stats1Label"), icon: <Users className="h-5 w-5" /> },
    { value: "5.000+", label: t("stats2Label"), icon: <Star className="h-5 w-5" /> },
    { value: "350+", label: t("stats3Label"), icon: <ShoppingBag className="h-5 w-5" /> },
    { value: "12", label: t("stats4Label"), icon: <MapPin className="h-5 w-5" /> },
  ];

  const partners = [
    {
      role: "VILLAGE_ADMIN" as const,
      icon: <Building2 className="h-8 w-8" />,
      title: tp("villageAdmin"),
      desc: tp("villageAdminDesc"),
      color: "bg-emerald-600",
      href: "/register",
    },
    {
      role: "ACCOMMODATION" as const,
      icon: <BedDouble className="h-8 w-8" />,
      title: tp("accommodation"),
      desc: tp("accommodationDesc"),
      color: "bg-blue-600",
      href: "/register",
    },
    {
      role: "UMKM" as const,
      icon: <ShoppingBag className="h-8 w-8" />,
      title: tp("umkm"),
      desc: tp("umkmDesc"),
      color: "bg-amber-600",
      href: "/register",
    },
    {
      role: "EVENT_ORGANIZER" as const,
      icon: <CalendarDays className="h-8 w-8" />,
      title: tp("eventOrganizer"),
      desc: tp("eventOrganizerDesc"),
      color: "bg-violet-600",
      href: "/register",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-800 to-stone-900 py-24 text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          {/* Batik pattern dots */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 mb-6">
            <Leaf className="h-4 w-4" />
            <span>{t("tagline")}</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-500/30">
                {t("heroCta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                {tc("login")}
              </Button>
            </Link>
          </div>

          {/* Quick Demo Access */}
          <div className="mt-6 text-sm text-emerald-300/70">
            {t("demoLabel")}: <span className="text-emerald-300 font-medium">admin@desawisata.id</span> / <span className="text-emerald-300 font-medium">password123</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center text-emerald-600 mb-2">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-stone-900">{stat.value}</div>
                <div className="mt-1 text-sm text-stone-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
              <Trophy className="h-4 w-4" />
              {t("featuresTitle")}
            </div>
            <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">{t("featuresTitle")}</h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">{t("featuresSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color} group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-linear-to-b from-stone-100 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">{t("partnersTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((p) => (
              <div
                key={p.role}
                className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${p.color} text-white shadow-lg`}>
                  {p.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-stone-900">{p.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">{p.desc}</p>
                <Link
                  href={p.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 group-hover:gap-2 transition-all"
                >
                  {tc("register")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-emerald-800 to-emerald-900 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mt-3 text-emerald-200 max-w-lg mx-auto">{t("ctaSubtitle")}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 border-0 shadow-lg shadow-amber-500/30">
                {t("ctaButton")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                {tc("login")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
