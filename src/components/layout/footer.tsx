"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Mitra Dewi</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-stone-400">{t("description")}</p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 text-stone-400 transition-colors hover:bg-emerald-600 hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 text-stone-400 transition-colors hover:bg-emerald-600 hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 text-stone-400 transition-colors hover:bg-emerald-600 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-100">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: tc("home") },
                { href: "/login", label: tCommon("login") },
                { href: "/register", label: tCommon("register") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-stone-400 transition-colors hover:text-emerald-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-100">{t("contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-stone-400">
                <Mail className="h-4 w-4 text-emerald-500" />
                info@mitradewi.id
              </li>
              <li className="flex items-center gap-2 text-stone-400">
                <Phone className="h-4 w-4 text-emerald-500" />
                +62 21 1234 5678
              </li>
              <li className="flex items-start gap-2 text-stone-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Yogyakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Mitra Dewi. {t("rights")}.</p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-emerald-400">{t("privacy")}</a>
            <a href="#" className="transition-colors hover:text-emerald-400">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
