"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/60 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 group-hover:bg-emerald-700 transition-colors">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold text-emerald-700">Mitra Dewi</span>
            <span className="hidden text-[10px] text-stone-500 sm:block">Desa Wisata Digital</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/login">
              <Button variant="outline" size="sm">{t("common.login")}</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">{t("common.register")}</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-64 border-b border-stone-200" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 bg-white px-4 py-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2 border-t border-stone-100 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">{t("common.login")}</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button size="sm" className="w-full">{t("common.register")}</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
