"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { hasModulePermission } from "@/lib/module-access";
import {
  LayoutDashboard,
  Building2,
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
  Image as ImageIcon,
  MessageCircle,
  ChevronDown,
  ChevronRight,
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
      { href: `${base}/village-admin/testimonials`, label: t("nav.testimonials"), icon: <MessageCircle className="h-4 w-4" />, permission: "facility.manage" },
      // Facilities
      { type: "section", label: t("nav.facilities") },
      { href: `${base}/village-admin/facilities`, label: isId ? "Kelola Fasilitas" : "Manage Facilities", icon: <BarChart3 className="h-4 w-4" />, permission: "facility.manage" },
      { href: `${base}/village-admin/facilities/reservations`, label: t("nav.facilityReservations"), icon: <ClipboardList className="h-4 w-4" />, permission: "facility.manage" },
      { href: `${base}/village-admin/coordination`, label: t("nav.externalCoordination"), icon: <MessageSquare className="h-4 w-4" /> },
      // Experiences
      { type: "section", label: isId ? "Experience & Tiket" : "Experience & Tickets" },
      { href: `${base}/village-admin/experiences/proposals`, label: isId ? "Persetujuan Proposal" : "Proposal Approvals", icon: <CheckSquare className="h-4 w-4" />, permission: "experience.approve" },
      { href: `${base}/village-admin/experiences`, label: isId ? "Experience & Tiket" : "Experience & Tickets", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/bundles`, label: isId ? "Paket Bundling" : "Bundled Packages", icon: <Package className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/calendar`, label: t("nav.calendar"), icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/articles`, label: isId ? "Artikel & Berita" : "Articles & News", icon: <FileText className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/speakers`, label: t("nav.speakers"), icon: <Users className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/attendees`, label: t("nav.attendees"), icon: <Users className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/village-admin/experiences/analytics`, label: isId ? "Analitik Experience" : "Experience Analytics", icon: <TrendingUp className="h-4 w-4" />, permission: "experience.analytics" },
      { href: `${base}/village-admin/investment`, label: isId ? "Investasi Desa" : "Village Investment", icon: <TrendingUp className="h-4 w-4" />, permission: "experience.analytics" },
      // Marketing
      { type: "section", label: isId ? "Pemasaran" : "Marketing" },
      { href: `${base}/village-admin/promotions`, label: isId ? "Promosi" : "Promotions", icon: <Megaphone className="h-4 w-4" />, permission: "experience.manage" },
      // Partners
      { type: "section", label: isId ? "Mitra" : "Partners" },
      { href: `${base}/village-admin/approval`, label: t("nav.partnerVerification"), icon: <CheckSquare className="h-4 w-4" />, permission: "experience.approve" },
      { href: `${base}/village-admin/partners`, label: isId ? "Daftar Mitra" : "Partner List", icon: <Users className="h-4 w-4" /> },
    ],
    ACCOMMODATION: [
      { href: `${base}/accommodation`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "accommodation.manage" },
      // Accommodation management
      { type: "section", label: isId ? "Penginapan" : "Accommodation" },
      { href: `${base}/accommodation/properties`, label: isId ? "Properti Saya" : "My Properties", icon: <BedDouble className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/rooms`, label: t("rooms.title"), icon: <BedDouble className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/reservations`, label: isId ? "Reservasi Masuk" : "Incoming Reservations", icon: <ClipboardList className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/cancellations`, label: isId ? "Pembatalan" : "Cancellations", icon: <CheckSquare className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/availability`, label: isId ? "Kalender Ketersediaan" : "Availability Calendar", icon: <CalendarDays className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/checkin`, label: isId ? "Check-in / Check-out" : "Check-in / Check-out", icon: <Users className="h-4 w-4" />, permission: "accommodation.manage" },
      { href: `${base}/accommodation/status`, label: t("nav.submissionStatus"), icon: <CheckSquare className="h-4 w-4" />, permission: "accommodation.manage" },
      // Experience
      { type: "section", label: isId ? "Experience & Tiket" : "Experience & Tickets" },
      { href: `${base}/accommodation/experiences`, label: isId ? "Experience & Tiket" : "Experience & Tickets", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/accommodation/experiences/proposals`, label: isId ? "Status Proposal" : "Proposal Status", icon: <FileText className="h-4 w-4" />, permission: "experience.manage" },
      // Marketing
      { type: "section", label: isId ? "Pemasaran" : "Marketing" },
      { href: `${base}/accommodation/promotions`, label: t("nav.promotions"), icon: <Megaphone className="h-4 w-4" /> },
      { href: `${base}/accommodation/reviews`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> },
      { href: `${base}/accommodation/disputes`, label: isId ? "Komplain" : "Disputes", icon: <MessageSquare className="h-4 w-4" /> },
    ] as NavElement[],
    UMKM: [
      { href: `${base}/sme`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "sme.manage" },
      // Products
      { type: "section", label: isId ? "Produk" : "Products" },
      { href: `${base}/sme/products`, label: isId ? "Kelola Produk" : "Manage Products", icon: <Package className="h-4 w-4" />, permission: "sme.manage" },
      { href: `${base}/sme/stock`, label: t("nav.stock"), icon: <TrendingUp className="h-4 w-4" />, permission: "sme.manage" },
      // Orders
      { type: "section", label: t("nav.orders") },
      { href: `${base}/sme/orders`, label: isId ? "Daftar Pesanan" : "Order List", icon: <ClipboardList className="h-4 w-4" />, permission: "sme.manage" },
      { href: `${base}/sme/hours`, label: isId ? "Jam Operasional" : "Operating Hours", icon: <CalendarDays className="h-4 w-4" />, permission: "sme.manage" },
      { href: `${base}/sme/preorders`, label: isId ? "Pre-Order" : "Pre-Orders", icon: <ClipboardList className="h-4 w-4" />, permission: "sme.manage" },
      { href: `${base}/sme/shipping`, label: isId ? "Pengiriman" : "Shipping", icon: <Package className="h-4 w-4" />, permission: "sme.manage" },
      // Experience
      { type: "section", label: isId ? "Experience & Tiket" : "Experience & Tickets" },
      { href: `${base}/sme/experiences`, label: isId ? "Experience & Tiket" : "Experience & Tickets", icon: <CalendarDays className="h-4 w-4" />, permission: "experience.manage" },
      { href: `${base}/sme/experiences/proposals`, label: isId ? "Status Proposal" : "Proposal Status", icon: <FileText className="h-4 w-4" />, permission: "experience.manage" },
      // Marketing
      { type: "section", label: isId ? "Pemasaran" : "Marketing" },
      { href: `${base}/sme/promotions`, label: t("nav.promotions"), icon: <Megaphone className="h-4 w-4" /> },
      { href: `${base}/sme/reviews`, label: t("dashboard.reviews"), icon: <Star className="h-4 w-4" /> },
      { href: `${base}/sme/disputes`, label: isId ? "Komplain" : "Disputes", icon: <MessageSquare className="h-4 w-4" /> },
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
      { href: `${base}/experience/disputes`, label: isId ? "Komplain" : "Disputes", icon: <MessageSquare className="h-4 w-4" /> },
    ],
    TRANSPORT: [
      { href: `${base}/transport`, label: t("nav.dashboard"), icon: <LayoutDashboard className="h-4 w-4" />, permission: "transport.manage" },
      { type: "section", label: isId ? "Operasional" : "Operations" },
      { href: `${base}/transport/orders`, label: isId ? "Pemesanan" : "Bookings", icon: <ClipboardList className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/fleet`, label: isId ? "Armada" : "Fleet", icon: <BedDouble className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/driver`, label: isId ? "Supir" : "Drivers", icon: <Users className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/availability`, label: isId ? "Kalender" : "Calendar", icon: <CalendarDays className="h-4 w-4" />, permission: "transport.manage" },
      { type: "section", label: isId ? "Layanan" : "Services" },
      { href: `${base}/transport/rates`, label: isId ? "Tarif" : "Rates", icon: <TrendingUp className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/routes`, label: isId ? "Paket Rute" : "Route Packages", icon: <CalendarDays className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/promotions`, label: isId ? "Promo" : "Promotions", icon: <Megaphone className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/analytics`, label: t("nav.analytics"), icon: <BarChart3 className="h-4 w-4" />, permission: "transport.manage" },
      { href: `${base}/transport/disputes`, label: isId ? "Komplain" : "Disputes", icon: <MessageSquare className="h-4 w-4" />, permission: "transport.manage" },
    ],
  };

  const sharedItems: NavElement[] = [
    // Finance
    { type: "section", label: isId ? "Keuangan" : "Finance" },
    ...(role === "VILLAGE_ADMIN"
      ? [
          { href: `${base}/village-admin/finance`, label: isId ? "Saldo & Keuangan" : "Balance & Finance", icon: <Wallet className="h-4 w-4" />, permission: "finance.manage" } as NavItem,
          { href: `${base}/village-admin/bank-account`, label: t("nav.bankAccount"), icon: <Wallet className="h-4 w-4" />, permission: "finance.manage" } as NavItem,
        ]
      : [
          { href: `${base}/finance`, label: isId ? "Ringkasan Keuangan" : "Financial Summary", icon: <Wallet className="h-4 w-4" />, permission: "finance.view" } as NavItem,
          { href: `${base}/finance/reports`, label: t("nav.financialReports"), icon: <TrendingUp className="h-4 w-4" />, permission: "finance.view" } as NavItem,
        ]),
    ...(role === "VILLAGE_ADMIN"
      ? [
          { type: "section", label: t("nav.media") } as NavSection,
          { href: `${base}/village-admin/media`, label: t("nav.media"), icon: <ImageIcon className="h-4 w-4" />, permission: "facility.manage" } as NavItem,
        ]
      : []),
    // General
    { type: "section", label: t("nav.general") },
    ...(role === "VILLAGE_ADMIN" ? [
      { href: `${base}/village-admin/analytics`, label: isId ? "Analitik Desa" : "Village Analytics", icon: <BarChart3 className="h-4 w-4" /> } as NavItem,
      { href: `${base}/village-admin/subscription`, label: isId ? "Paket Langganan" : "Subscription", icon: <TrendingUp className="h-4 w-4" /> } as NavItem,
    ] : []),
    { href: `${base}/chat`, label: t("dashboard.chat"), icon: <MessageSquare className="h-4 w-4" />, permission: "chat.access" },
    { href: `${base}/notifications`, label: t("nav.notifications"), icon: <MessageCircle className="h-4 w-4" />, permission: "settings.manage" },
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

  const indexRoutes = [
    "/dashboard",
    "/dashboard/accommodation",
    "/dashboard/sme",
    "/dashboard/experience",
    "/dashboard/village-admin",
    "/dashboard/finance",
    "/dashboard/transport",
  ];

  const isItemActive = (href: string) => {
    const isIndexRoute = indexRoutes.some((route) => href.endsWith(route));
    if (isIndexRoute) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const canBeExpandableParent = (href: string) => {
    const nonExpandableRoots = [
      "/dashboard",
      "/dashboard/village-admin",
      "/dashboard/accommodation",
      "/dashboard/sme",
      "/dashboard/experience",
      "/dashboard/transport",
      "/dashboard/finance",
    ];
    return !nonExpandableRoots.some((route) => href.endsWith(route));
  };

  type RenderNode =
    | { kind: "section"; section: NavSection }
    | { kind: "item"; item: NavItem }
    | { kind: "group"; parent: NavItem; children: NavItem[] };

  const renderNodes = useMemo<RenderNode[]>(() => {
    const nodes: RenderNode[] = [];

    const getChildPriority = (childHref: string, parentHref: string) => {
      const relative = childHref.replace(`${parentHref}/`, "");
      const firstSegment = relative.split("/")[0] ?? "";

      const priorityMap: Record<string, number> = {
        proposals: 10,
        calendar: 20,
        speakers: 30,
        attendees: 40,
        documents: 50,
        reservations: 60,
        promotions: 70,
        reviews: 80,
        disputes: 90,
        analytics: 100,
      };

      return priorityMap[firstSegment] ?? 1000;
    };

    type SectionChunk = { section?: NavSection; items: NavItem[] };
    const chunks: SectionChunk[] = [];
    let current: SectionChunk = { items: [] };

    for (const element of navItems) {
      if ("type" in element) {
        if (current.items.length > 0 || current.section) {
          chunks.push(current);
        }
        current = { section: element, items: [] };
      } else {
        current.items.push(element);
      }
    }

    if (current.items.length > 0 || current.section) {
      chunks.push(current);
    }

    for (const chunk of chunks) {
      if (chunk.section) {
        nodes.push({ kind: "section", section: chunk.section });
      }

      const parentOf = new Map<string, string>();
      const childrenByParent = new Map<string, NavItem[]>();

      for (const child of chunk.items) {
        let bestParent: NavItem | null = null;

        for (const parent of chunk.items) {
          if (parent.href === child.href) continue;
          if (!canBeExpandableParent(parent.href)) continue;
          if (!child.href.startsWith(`${parent.href}/`)) continue;

          if (!bestParent || parent.href.length > bestParent.href.length) {
            bestParent = parent;
          }
        }

        if (bestParent) {
          parentOf.set(child.href, bestParent.href);
          const siblings = childrenByParent.get(bestParent.href) ?? [];
          siblings.push(child);
          childrenByParent.set(bestParent.href, siblings);
        }
      }

      for (const item of chunk.items) {
        if (parentOf.has(item.href)) continue;

        const children = childrenByParent.get(item.href) ?? [];
        if (children.length > 0) {
          const sortedChildren = [...children].sort((a, b) => {
            const pa = getChildPriority(a.href, item.href);
            const pb = getChildPriority(b.href, item.href);

            if (pa !== pb) return pa - pb;
            return a.label.localeCompare(b.label);
          });

          nodes.push({ kind: "group", parent: item, children: sortedChildren });
        } else {
          nodes.push({ kind: "item", item });
        }
      }
    }

    return nodes;
  }, [navItems]);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const roleColors: Record<PartnerRole, string> = {
    VILLAGE_ADMIN: "bg-primary",
    ACCOMMODATION: "bg-blue-600",
    UMKM: "bg-amber-600",
    EVENT_ORGANIZER: "bg-violet-600",
    TRANSPORT: "bg-sky-600",
  };

  const roleLabel =
    user.role === "VILLAGE_ADMIN"
      ? "villageAdmin"
      : user.role === "ACCOMMODATION"
      ? "accommodation"
      : user.role === "UMKM"
      ? "umkm"
      : user.role === "TRANSPORT"
      ? "transport"
      : "eventOrganizer";

  return (
    <aside className="flex h-full w-72 flex-col bg-surface-container-lowest shadow-[2px_0_12px_rgba(25,28,32,0.04)] lg:w-64">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 pt-6 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient shadow-ambient">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-display font-bold text-on-surface">Mitra Dewi</p>
          <p className="truncate text-[11px] font-body text-on-surface/50">Admin Panel</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 pb-3">
        <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium font-body text-white shadow-ambient", roleColors[user.role])}>
          {t(`partner.${roleLabel}`)}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-color:var(--color-surface-container-high)_transparent] [scrollbar-width:thin]">
        <ul className="space-y-0.5">
          {renderNodes.map((node, idx) => {
            if (node.kind === "section") {
              return (
                <li key={`section-${idx}`} className="pt-4 pb-1.5 first:pt-1.5">
                  <p className="label-sm px-3 text-on-surface/40">
                    {node.section.label}
                  </p>
                </li>
              );
            }

            if (node.kind === "group") {
              const parentActive = isItemActive(node.parent.href);
              const childActive = node.children.some((child) => isItemActive(child.href));
              const isOpen = expandedGroups[node.parent.href] ?? (parentActive || childActive);

              return (
                <li key={`group-${node.parent.href}`} className="space-y-1">
                  <div
                    className={cn(
                      "group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-body transition-colors duration-150",
                      parentActive || childActive
                        ? "bg-primary/[0.08] text-primary font-semibold"
                        : "text-on-surface/60 hover:bg-surface-container-low hover:text-on-surface",
                    )}
                  >
                    <Link
                      href={node.parent.href}
                      onClick={onClose}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      {node.parent.icon}
                      <span className="truncate">{node.parent.label}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroups((prev) => ({
                          ...prev,
                          [node.parent.href]: !isOpen,
                        }))
                      }
                      className="rounded p-0.5 text-on-surface/60 hover:text-on-surface"
                      aria-label={isOpen ? (isId ? "Tutup submenu" : "Collapse submenu") : (isId ? "Buka submenu" : "Expand submenu")}
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>

                  {isOpen ? (
                    <ul className="ml-3 space-y-0.5 border-l border-surface-container-high pl-2">
                      {node.children.map((child) => {
                        const active = isItemActive(child.href);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-body transition-colors duration-150",
                                active
                                  ? "bg-primary/[0.08] text-primary font-semibold"
                                  : "text-on-surface/60 hover:bg-surface-container-low hover:text-on-surface",
                              )}
                            >
                              {child.icon}
                              <span className="truncate">{child.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            }

            const item = node.item;
            const isActive = isItemActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-body transition-colors duration-150",
                    isActive
                      ? "bg-primary/[0.08] text-primary font-semibold"
                      : "text-on-surface/60 hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="bg-surface-container-low p-3 rounded-b-none">
        <div className="mb-2 rounded-xl bg-surface-container px-2.5 py-2 text-[11px] font-body text-on-surface/50">
          {isId
            ? "Akses modul dikontrol Super Admin berdasarkan role & permission."
            : "Module access is controlled by Super Admin based on role and permissions."}
        </div>
        <div className="mb-1 flex items-center gap-3 rounded-xl bg-surface-container px-2.5 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-gradient text-white text-xs font-display font-bold shrink-0">
            {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-body font-medium text-on-surface">{user.fullName}</p>
            <p className="truncate text-xs font-body text-on-surface/50">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-body text-on-surface/60 transition-colors hover:bg-surface-container hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}
