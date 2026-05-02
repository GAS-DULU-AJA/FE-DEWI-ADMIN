import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const runtime = "edge";

type Locale = (typeof routing.locales)[number];

const localeMetadata = {
  id: {
    title: "Mitra Dewi — Platform Digital Desa Wisata",
    description:
      "Platform digital terpadu untuk mitra desa wisata Indonesia. Kelola penginapan, UMKM, acara, dan lebih banyak lagi.",
  },
  en: {
    title: "Mitra Dewi — Tourism Village Digital Platform",
    description:
      "An integrated digital platform for Indonesian tourism village partners. Manage accommodations, SMEs, events, and more.",
  },
  ja: {
    title: "Mitra Dewi — 観光村デジタルプラットフォーム",
    description:
      "インドネシアの観光村パートナー向け統合デジタルプラットフォーム。宿泊施設、UMKM、イベントなどを管理できます。",
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = hasLocale(routing.locales, locale)
    ? localeMetadata[locale]
    : localeMetadata[routing.defaultLocale];

  return {
    title: {
      template: "%s | Mitra Dewi",
      default: metadata.title,
    },
    description: metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <div
          lang={locale}
          className={`${displayFont.variable} ${bodyFont.variable} font-body antialiased`}
        >
          {children}
        </div>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
