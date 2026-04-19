"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { hasModulePermission } from "@/lib/module-access";
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
  LogOut,
  Leaf,
  BarChart3,
  Wallet,
  Megaphone,
  FileText,
} from "lucide-react";
import type { PartnerRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
  permission?: import("@/lib/module-access").ModulePermission;
}

interface NavSection {
  type: "section";
  label: string;
}

type NavElement = NavItem | NavSection;

function getNavItems(role: PartnerRole, t: ReturnType<typeof useTranslations>, isId: boolean): NavElement[] {
  const base = "/dashboard";

  const roleItems: Record<PartnerRole, NavElement[]> = {
    VILLAGE_ADMIN: [
      { href: `${base}/village-admin`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "experience.manage" },
      // Village Profile
      { type: "section", label: isId ? "Profil Desa" : "Village Profile" },
      { href: `${base}/village-admin/village-data`, label: t("nav.villageManagement"), icon: <Building2 className="h-4 w-4" />, permission: "facility.manage" },
      { href: `${base}/village-admin/bank-account`, label: t("nav.bankAccount"), icon: <Wallet className="h-4 w-4" />, permission: "finance.manage" },
      // Facilities
      { type: "section", label: t("nav.facilities") },
      { href: `${base}/village-admin/facilities`, label: isId ? "Kelola Fasilitas" : "Manage Facilities", icon: <BarChart3 className="h-4 w-4" />, permission: "facility.manage" },
      { href: `${base}/village-admin/facilities/reservations`, label: t("nav.facilityReservations"), icon: <ClipboardList className="h-4 w-4" />, permission: "facility.manage" },
      // Experiences
      { type: "section", label: t("nav.experiences") },
      { href: `${base}/village-admin/experiences/proposals`, label: isId ? "Persetujuan Proposal" : "Proposal Approvals", icon: <CheckSquare className="h-4 w-4" />, permission: "experience.approve" },
      { href: `${base}/village-admin/experiences`, label: isId ? "Kelola Experience" : "Manage Experiences", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/calendar`, label: t("nav.calendar"), icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/speakers`, label: t("nav.speakers"), icon: <Users className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/attendees`, label: t("nav.attendees"), icon: <Users className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/analytics`, label: isId ? "Analitik Experience" : "Experience Analytics", icon: <TrendingUp className="h-4 w-4" />, permission: "experience.analytics" },
      // Partners
      { type: "section", label: isId ? "Mitra" : "Partners" },
      { href: `${base}/village-admin/approval`, label: t("nav.partnerVerification"), icon: <CheckSquare className="h-4 w-4" />, permission: "experience.approve" },
      { href: `${base}/village-admin/partners`, label: isId ? "Daftar Mitra" : "Partner List", icon: <Users className="h-4 w-4" /> },
      { href: `${base}/village-admin/coordination`, label: t("nav.externalCoordination"), icon: <MessageSquare className="h-4 w-4" /> },
    ],
    ACCOMMODATION: [
      { href: `${base}/accommodation`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "accommodation.manage" },
      // Accommodation management
      { type: "section", label: isId ? "Penginapan" : "Accommodation" },
      { href: `${base}/accommodation/properties`, label: isId ? "Properti Saya" : "My Properties", icon: <BedDouble className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/rooms`, label: t("rooms.title"), icon: <BedDouble className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/reservations`, label: t("reservations.title"), icon: <ClipboardList className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/status`, label: t("nav.submissionStatus"), icon: <CheckSquare className="h-4 w-4" />, permission: "accommodation.manage" },
      // Experience
      { type: "section", label: "Experience" },
      { href: `${base}/accommodation/experiences`, label: isId ? "Kelola Experience" : "Manage Experiences", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/accommodation/experiences/proposals`, label: isId ? "Status Proposal" : "Proposal Status", icon: <FileText className="h-4 w-4" />, permission: "experience.manage" },
      // Marketing
      { type: "section", label: isId ? "Pemasaran" : "Marketing" },
      { href: `${base}/accommodation/promotions`, label: t("nav.promotions"), icon: <Megaphone className="h-4 w-4" /> },
      { href: `${base}/accommodation/reviews`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> },
    ] as NavElement[],
    UMKM: [
      { href: `${base}/sme`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "sme.manage" },
      // Products
      { type: "section", label: t("products.title") },
      { href: `${base}/sme/products`, label: isId ? "Kelola Produk" : "Manage Products", icon: <Package className="h-4 w-4" />, permission: "sme.manage" },
      { href: `${base}/sme/stock`, label: t("nav.stock"), icon: <TrendingUp className="h-4 w-4" />, permission: "sme.manage" },
      // Orders
      { type: "section", label: t("nav.orders") },
      { href: `${base}/sme/orders`, label: isId ? "Daftar Pesanan" : "Order List", icon: <ClipboardList className="h-4 w-4" />, permission: "sme.manage" },
      // Experience
      { type: "section", label: "Experience" },
      { href: `${base}/sme/experiences`, label: isId ? "Kelola Experience" : "Manage Experiences", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/sme/experiences/proposals`, label: isId ? "Status Proposal" : "Proposal Status", icon: <FileText className="h-4 w-4" />, permission: "experience.manage" },
      // Marketing
      { type: "section", label: isId ? "Pemasaran" : "Marketing" },
      { href: `${base}/sme/promotions`, label: t("nav.promotions"), icon: <Megaphone className="h-4 w-4" /> },
      { href: `${base}/sme/reviews`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> },
    ],
    EVENT_ORGANIZER: [
      { href: `${base}/experience`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "experience.manage" },
      // Experience
      { type: "section", label: t("nav.experiences") },
      { href: `${base}/experience/events`, label: isId ? "Kelola Experience" : "Manage Experiences", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/experience/calendar`, label: t("nav.calendar"), icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/experience/speakers`, label: t("nav.speakers"), icon: <Users className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/experience/documents`, label: t("nav.documents"), icon: <FileText className="h-4 w-4" /> },
      { href: `${base}/experience/proposals`, label: isId ? "Status Proposal" : "Proposal Status", icon: <CheckSquare className="h-4 w-4" />, permission: "experience.manage" },
      // Operations
      { type: "section", label: isId ? "Operasional" : "Operations" },
      { href: `${base}/experience/reservations`, label: t("reservations.title"), icon: <ClipboardList className="h-4 w-4" /> },
      { href: `${base}/experience/attendees`, label: t("nav.attendees"), icon: <Users className="h-4 w-4" /> },
      { href: `${base}/experience/coordination`, label: t("nav.externalCoordination"), icon: <MessageSquare className="h-4 w-4" /> },
      { href: `${base}/experience/post-event`, label: t("nav.postEvent"), icon: <Star className="h-4 w-4" /> },
      // Insights
      { type: "section", label: t("nav.insights") },
      { href: `${base}/experience/analytics`, label: t("nav.experienceAnalytics"), icon: <TrendingUp className="h-4 w-4" /> },
      { href: `${base}/experience/promotions`, label: t("nav.promotions"), icon: <Megaphone className="h-4 w-4" /> },
      { href: `${base}/experience/reviews`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> },
    ],
  };

  const sharedItems: NavElement[] = [
    // Finance
    { type: "section", label: isId ? "Keuangan" : "Finance" },
    { href: `${base}/finance`, label: isId ? "Ringkasan Keuangan" : "Financial Summary", icon: <Wallet className="h-4 w-4" />, permission: "finance.view" },
    { href: `${base}/finance/reports`, label: t("nav.financialReports"), icon: <TrendingUp className="h-4 w-4" />, permission: "finance.view" },
    // General
    { type: "section", label: t("nav.general") },
    ...(role === "VILLAGE_ADMIN" ? [
      { href: `${base}/village-admin/analytics`, label: isId ? "Analitik Desa" : "Village Analytics", icon: <BarChart3 className="h-4 w-4" /> } as NavItem,
    ] : []),
    { href: `${base}/chat`, label: t("dashboard.chat"), icon: <MessageSquare className="h-4 w-4" />, permission: "chat.access" },
    { href: `${base}/settings`, label: t("nav.settings"), icon: <Settings className="h-4 w-4" />, permission: "settings.manage" },
  ];

  const withPermission = [...(roleItems[role] || []), ...sharedItems].filter((element) => {
    if ("type" in element) return true;
    return hasModulePermission(role, element.permission);
  });

  const compacted: NavElement[] = [];
  for (let i = 0; i < withPermission.length; i += 1) {
    const current = withPermission[i];
    if ("type" in current) {
      const next = withPermission[i + 1];
      if (!next || "type" in next) continue;
    }
    compacted.push(current);
  }

  return compacted;
}

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === "id";
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const navItems = getNavItems(user.role, t, isId);

  const roleColors: Record<PartnerRole, string> = {
    VILLAGE_ADMIN: "bg-emerald-600",
    ACCOMMODATION: "bg-blue-600",
    UMKM: "bg-amber-600",
    EVENT_ORGANIZER: "bg-violet-600",
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-stone-800 bg-stone-950 text-stone-100 lg:w-64">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-stone-800 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-800/30">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">Mitra Dewi</p>
          <p className="truncate text-[11px] text-stone-400">Admin Panel</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3">
        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm", roleColors[user.role])}>
          {t(`partner.${user.role === "VILLAGE_ADMIN" ? "villageAdmin" : user.role === "ACCOMMODATION" ? "accommodation" : user.role === "UMKM" ? "umkm" : "eventOrganizer"}`)}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-color:#57534e_transparent] [scrollbar-width:thin]">
        <ul className="space-y-0.5">
          {navItems.map((element, idx) => {
            // Handle section headers
            if ("type" in element && element.type === "section") {
              return (
                <li key={`section-${idx}`} className="pt-3 pb-1.5 first:pt-1.5">
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400/90">
                    {element.label}
                  </p>
                </li>
              );
            }

            const item = element as NavItem;
            const indexRoutes = ["/dashboard", "/dashboard/accommodation", "/dashboard/sme", "/dashboard/experience", "/dashboard/village-admin", "/dashboard/finance"];
            const isActive = indexRoutes.some((r) => item.href.endsWith(r))
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                    isActive
                      ? "bg-emerald-600 text-white font-medium shadow-sm shadow-emerald-950/30"
                      : "text-stone-400 hover:bg-stone-800/90 hover:text-stone-100"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-all",
                      isActive ? "bg-white/90" : "bg-transparent group-hover:bg-stone-500"
                    )}
                  />
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-stone-800 p-3">
        <div className="mb-2 rounded-lg border border-stone-800 bg-stone-900/70 px-2.5 py-2 text-[11px] text-stone-400">
          {isId
            ? "Akses modul dikontrol Super Admin berdasarkan role & permission."
            : "Module access is controlled by Super Admin based on role and permissions."}
        </div>
        <div className="mb-1 flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900/70 px-2.5 py-2.5">
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
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-400 transition-colors hover:bg-stone-800 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}
