"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { ExperienceCard } from "@/features/experience/components/experience-card";
import { ExperienceDashboardCharts } from "@/features/experience/components/dashboard-charts";
import { Link } from "@/i18n/navigation";
import type { ExperienceItem } from "@/features/experience/types";
import {
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  LineChart,
  ShieldCheck,
  Ticket,
  Wallet,
  Wrench,
} from "lucide-react";
import { useLocale } from "next-intl";

type DashboardFeature = {
  title: string;
  description: string;
  href?: string;
  status: "active" | "roadmap";
};

type DashboardSection = {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: DashboardFeature[];
};

type TabId = "overview" | "sections" | "active";

export function ExperienceDashboardSectionsTabs({ experiences }: { experiences: ExperienceItem[] }) {
  const locale = useLocale();
  const isId = locale === "id";
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const sections: DashboardSection[] = useMemo(
    () => [
      {
        key: "operations",
        title: isId ? "Operasional Event" : "Event Operations",
        description: isId
          ? "Perencanaan acara dari setup awal sampai eksekusi hari-H."
          : "Plan each event from setup to day-of execution.",
        icon: CalendarDays,
        features: [
          {
            title: "Event Creation & Setup",
            description: isId
              ? "Kelola event, kategori, visibilitas, status publish, dan media utama."
              : "Manage event setup, categories, visibility, publish state, and core media.",
            href: "/dashboard/experience/events",
            status: "active",
          },
          {
            title: "Scheduling & Agenda",
            description: isId
              ? "Atur jadwal, lihat kalender pengalaman, dan deteksi bentrok waktu."
              : "Organize schedule, review calendar, and detect time conflicts.",
            href: "/dashboard/experience/calendar",
            status: "active",
          },
          {
            title: "Speaker / Talent Management",
            description: isId
              ? "Kelola profil pembicara, assignment sesi, dan koordinasi talent."
              : "Manage speaker profiles, session assignment, and talent coordination.",
            href: "/dashboard/experience/speakers",
            status: "active",
          },
          {
            title: "On-site Event Tools",
            description: isId
              ? "Pantau check-in peserta dan kesiapan operasional saat event berlangsung."
              : "Monitor attendee check-ins and on-site operations during the event.",
            href: "/dashboard/experience/attendees",
            status: "active",
          },
        ],
      },
      {
        key: "ticketing",
        title: isId ? "Ticketing & Peserta" : "Ticketing & Attendees",
        description: isId
          ? "Kontrol penjualan tiket, reservasi, pembayaran, dan siklus peserta."
          : "Control ticket sales, reservations, payments, and attendee lifecycle.",
        icon: Ticket,
        features: [
          {
            title: "Ticketing Management",
            description: isId
              ? "Atur tipe tiket, kuota, harga, periode jual, promo, dan refund."
              : "Configure ticket types, quotas, pricing, sales windows, promos, and refunds.",
            href: "/dashboard/experience/reservations",
            status: "active",
          },
          {
            title: "Attendee Management",
            description: isId
              ? "Lacak status registrasi, check-in, pembatalan, dan kehadiran."
              : "Track registration, check-in, cancellation, and attendance status.",
            href: "/dashboard/experience/attendees",
            status: "active",
          },
          {
            title: "Payment & Financial Management",
            description: isId
              ? "Integrasi payment gateway dan rekonsiliasi finansial event berbayar."
              : "Payment gateway integration and paid-event financial reconciliation.",
            href: "/dashboard/experience/reservations",
            status: "active",
          },
        ],
      },
      {
        key: "growth",
        title: isId ? "Promosi, Insight & Pasca-Acara" : "Promotion, Insights & Post-Event",
        description: isId
          ? "Dorong pertumbuhan event melalui promosi, analitik, dan evaluasi akhir."
          : "Drive growth through promotion, analytics, and post-event follow up.",
        icon: LineChart,
        features: [
          {
            title: "Promotion & Marketing",
            description: isId
              ? "Kelola kampanye promo, kode diskon, dan aktivasi kanal pemasaran."
              : "Manage campaigns, discount codes, and marketing activations.",
            href: "/dashboard/experience/promotions",
            status: "active",
          },
          {
            title: "Analytics & Reporting",
            description: isId
              ? "Analisis penjualan tiket, revenue, konversi, dan performa pengalaman."
              : "Analyze ticket sales, revenue, conversion, and experience performance.",
            href: "/dashboard/experience/analytics",
            status: "active",
          },
          {
            title: "Document & Asset Management",
            description: isId
              ? "Simpan dokumen rundown, kontrak, dan aset media operasional acara."
              : "Store runbook docs, contracts, and operational media assets.",
            href: "/dashboard/experience/documents",
            status: "active",
          },
          {
            title: "Post-Event Features",
            description: isId
              ? "Kelola feedback peserta, ringkasan hasil event, dan tindak lanjut."
              : "Handle attendee feedback, event summary, and follow-up actions.",
            href: "/dashboard/experience/post-event",
            status: "active",
          },
        ],
      },
      {
        key: "governance",
        title: isId ? "Governance & Integrasi" : "Governance & Integrations",
        description: isId
          ? "Pastikan koordinasi lintas pihak berjalan rapi dan skalabel."
          : "Keep cross-team coordination structured and scalable.",
        icon: ShieldCheck,
        features: [
          {
            title: "External Coordination",
            description: isId
              ? "Koordinasi kebutuhan fasilitas dan operasional dengan desa mitra."
              : "Coordinate facility and operations needs with partner villages.",
            href: "/dashboard/experience/coordination",
            status: "active",
          },
          {
            title: "Notification System",
            description: isId
              ? "Notifikasi otomatis untuk konfirmasi, pengingat, dan perubahan jadwal."
              : "Automated confirmations, reminders, and schedule change alerts.",
            status: "roadmap",
          },
          {
            title: "Role & Permission Management",
            description: isId
              ? "Kontrol akses berbasis peran untuk tim organizer dan operator event."
              : "Role-based access for organizer and event operation teams.",
            status: "roadmap",
          },
          {
            title: "Integration Layer",
            description: isId
              ? "Integrasi kalender, CRM, platform streaming, dan API pihak ketiga."
              : "Connect calendar, CRM, streaming platforms, and external APIs.",
            status: "roadmap",
          },
        ],
      },
    ],
    [isId]
  );

  const quickActions = [
    {
      label: isId ? "Buat Pengalaman Baru" : "Create New Experience",
      href: "/dashboard/experience/events/add",
      icon: BadgeCheck,
    },
    {
      label: isId ? "Buka Kalender" : "Open Calendar",
      href: "/dashboard/experience/calendar",
      icon: CalendarClock,
    },
    {
      label: isId ? "Pantau Reservasi" : "Monitor Reservations",
      href: "/dashboard/experience/reservations",
      icon: Wallet,
    },
  ];

  const tabItems: Array<{ id: TabId; label: string }> = [
    { id: "overview", label: isId ? "Ringkasan" : "Overview" },
    { id: "sections", label: isId ? "Modul Fitur" : "Feature Modules" },
    { id: "active", label: isId ? "Event Aktif" : "Active Events" },
  ];

  return (
    <div className="space-y-4">
      <SegmentedTabs
        tabs={tabItems}
        active={activeTab}
        onChange={setActiveTab}
        sticky
      />

      {activeTab === "overview" && (
        <div className="space-y-4">
          <Card className="border-violet-200 bg-linear-to-br from-violet-50 via-white to-surface-container-low">
            <CardHeader>
              <CardTitle className="text-base text-on-surface">Experience Control Center</CardTitle>
              <CardDescription>
                {isId
                  ? "Navigasi modul utama event organizer dari setup event sampai evaluasi pasca-acara."
                  : "Navigate core event organizer modules from setup to post-event evaluation."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button key={action.href} asChild size="sm">
                    <Link href={action.href}>
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <ExperienceDashboardCharts />
        </div>
      )}

      {activeTab === "sections" && (
        <div className="space-y-4">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <Card key={section.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-surface-container p-2 text-on-surface/80">
                      <SectionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {section.features.map((feature) => {
                      const isActive = feature.status === "active";
                      return (
                        <div key={feature.title} className="rounded-lg border border-surface-container-high bg-surface-container-low p-4">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <h3 className="text-sm font-semibold text-on-surface">{feature.title}</h3>
                            <Badge variant={isActive ? "default" : "amber"}>
                              {isActive ? (isId ? "Aktif" : "Active") : "Roadmap"}
                            </Badge>
                          </div>
                          <p className="text-xs text-on-surface/70">{feature.description}</p>
                          {feature.href ? (
                            <div className="mt-3">
                              <Button asChild variant="outline" size="sm">
                                <Link href={feature.href}>{isId ? "Buka Modul" : "Open Module"}</Link>
                              </Button>
                            </div>
                          ) : (
                            <p className="mt-3 text-xs font-medium text-amber-700">
                              {isId ? "Akan tersedia di fase berikutnya" : "Planned for upcoming phase"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "active" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-on-surface/60" />
            <p className="text-sm font-semibold text-on-surface">
              {isId ? "Event yang Sedang Berjalan" : "Current Active Experiences"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
