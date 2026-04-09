"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { ACCOMMODATIONS } from "@/features/accommodation";
import {
  LayoutDashboard,
  Building2,
  ShoppingBag,
  CalendarDays,
  Users,
  CheckSquare,
  BedDouble,
  ClipboardList,
  Package,
  TrendingUp,
  MessageSquare,
  Star,
  Settings,
  Plus,
  LogOut,
  Leaf,
  Truck,
  BarChart3,
  Wallet,
} from "lucide-react";
import type { PartnerRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: PartnerRole, t: ReturnType<typeof useTranslations>): NavItem[] {
  const base = "/dashboard";

  const commonItems: NavItem[] = [
    {
      href: `${base}`,
      label: t("dashboard.overview"),
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
  ];

  const defaultAccommodationId = ACCOMMODATIONS[0]?.id ?? "acc-1";

  const roleItems: Record<PartnerRole, NavItem[]> = {
    VILLAGE_ADMIN: [
      { href: `${base}/pengelola-desa`, label: t("partner.villageAdmin"), icon: <Building2 className="h-4 w-4" /> },
      { href: `${base}/pengelola-desa/approval`, label: t("approval.title"), icon: <CheckSquare className="h-4 w-4" /> },
      { href: `${base}/pengelola-desa/mitra`, label: t("dashboard.totalPartners"), icon: <Users className="h-4 w-4" /> },
      { href: `${base}/pengelola-desa/analitik`, label: t("nav.dashboard"), icon: <BarChart3 className="h-4 w-4" /> },
    ],
    ACCOMMODATION: [
      { href: `${base}/penginapan`, label: t("partner.accommodation"), icon: <BedDouble className="h-4 w-4" /> },
      { href: `${base}/penginapan/tambah`, label: "Ajukan Penginapan", icon: <Plus className="h-4 w-4" /> },
      { href: `${base}/penginapan/kamar`, label: t("rooms.title"), icon: <BedDouble className="h-4 w-4" /> },
      { href: `${base}/penginapan/reservasi`, label: t("reservations.title"), icon: <ClipboardList className="h-4 w-4" /> },
      { href: `${base}/penginapan/ulasan`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> },
      { href: `${base}/penginapan/${defaultAccommodationId}/status`, label: "Status Pengajuan", icon: <CheckSquare className="h-4 w-4" /> },
      { href: `${base}/penginapan/${defaultAccommodationId}/pengaturan`, label: t("nav.settings"), icon: <Settings className="h-4 w-4" /> },
    ],
    UMKM: [
      { href: `${base}/umkm`, label: t("partner.umkm"), icon: <ShoppingBag className="h-4 w-4" /> },
      { href: `${base}/umkm/produk`, label: t("products.title"), icon: <Package className="h-4 w-4" /> },
      { href: `${base}/umkm/stok`, label: t("nav.stock"), icon: <TrendingUp className="h-4 w-4" /> },
      { href: `${base}/umkm/pesanan`, label: t("nav.orders"), icon: <ClipboardList className="h-4 w-4" /> },
      { href: `${base}/umkm/pengiriman`, label: t("nav.shipping"), icon: <Truck className="h-4 w-4" /> },
    ],
    EVENT_ORGANIZER: [
      { href: `${base}/event-organizer`, label: t("partner.eventOrganizer"), icon: <CalendarDays className="h-4 w-4" /> },
      { href: `${base}/event-organizer/acara`, label: t("events.title"), icon: <CalendarDays className="h-4 w-4" /> },
      { href: `${base}/event-organizer/kalender`, label: t("events.title"), icon: <CalendarDays className="h-4 w-4" /> },
    ],
  };

  const sharedItems: NavItem[] = [
    ...(role === "ACCOMMODATION"
      ? []
      : [{ href: `${base}/ulasan`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> }]),
    { href: `${base}/chat`, label: t("dashboard.chat"), icon: <MessageSquare className="h-4 w-4" /> },
    { href: `${base}/keuangan/laporan`, label: "Laporan Keuangan", icon: <TrendingUp className="h-4 w-4" /> },
    { href: `${base}/keuangan/manajemen`, label: "Manajemen Keuangan", icon: <Wallet className="h-4 w-4" /> },
    { href: `${base}/pengaturan`, label: t("nav.settings"), icon: <Settings className="h-4 w-4" /> },
  ];

  return [...commonItems, ...(roleItems[role] || []), ...sharedItems];
}

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const t = useTranslations();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const navItems = getNavItems(user.role, t);

  const roleColors: Record<PartnerRole, string> = {
    VILLAGE_ADMIN: "bg-emerald-600",
    ACCOMMODATION: "bg-blue-600",
    UMKM: "bg-amber-600",
    EVENT_ORGANIZER: "bg-violet-600",
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-stone-950 text-stone-100">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-stone-800 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <span className="text-base font-bold text-white">Mitra Dewi</span>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3">
        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white", roleColors[user.role])}>
          {t(`partner.${user.role === "VILLAGE_ADMIN" ? "villageAdmin" : user.role === "ACCOMMODATION" ? "accommodation" : user.role === "UMKM" ? "umkm" : "eventOrganizer"}`)}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const indexRoutes = ["/dashboard", "/dashboard/penginapan", "/dashboard/umkm", "/dashboard/event-organizer", "/dashboard/pengelola-desa"];
            const isActive = indexRoutes.some((r) => item.href.endsWith(r))
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-emerald-600 text-white font-medium"
                      : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-stone-800 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0">
            {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
            <p className="truncate text-xs text-stone-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-400 hover:bg-stone-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}
