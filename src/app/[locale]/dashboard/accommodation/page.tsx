"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ACCOMMODATIONS,
} from "@/features/accommodation/mock-data";
import { AccommodationCard } from "@/features/accommodation/components/accommodation-card";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { PropertySwitcher } from "@/features/accommodation/components/property-switcher";
import {
  getAllRooms,
  getAllReservations,
} from "@/features/accommodation/utils";
import {
  MonthlyRevenueTrendChart,
  ReservationStatusDonutChart,
} from "@/features/accommodation/components/dashboard-charts";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Plus, BedDouble, CheckCircle } from "lucide-react";

export default function PenginapanDashboard() {
  const t = useTranslations("dashboard");
  const rooms = getAllRooms();
  const reservations = getAllReservations();

  // ── Metrics ──
  const totalProperties = ACCOMMODATIONS.length;
  const activeProperties = ACCOMMODATIONS.filter(
    (acc) => acc.isPublished && acc.submissionStatus === "approved"
  ).length;
  const totalRooms = rooms.length;
  const totalUnits = rooms.reduce((sum, r) => sum + r.totalUnits, 0);
  const availableUnits = rooms.reduce((sum, r) => sum + r.availableUnits, 0);

  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(
    (r) => r.status === "confirmed" || r.status === "checked_in"
  ).length;

  const paidRevenue = reservations
    .filter((r) => r.paymentStatus === "success")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const avgOccupancy = totalProperties > 0 
    ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title={t("accommodationDashboard")}
        description={t("accommodationDescription")}
        breadcrumbs={[{ label: t("title") }, { label: t("accommodation") }]}
        action={
          <Button asChild size="sm">
            <Link href="/dashboard/accommodation/add">
              <Plus className="mr-1 h-4 w-4" />
              {t("addAccommodation")}
            </Link>
          </Button>
        }
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label={t("activeProperties")} value={activeProperties} icon="bed" color="blue" suffix={`/ ${totalProperties}`} />
        <StatCard label={t("totalRooms")} value={totalRooms} icon="bed" color="emerald" suffix={`(${totalUnits} unit)`} />
        <StatCard label={t("occupancyRate")} value={`${avgOccupancy}%`} icon="calendar" color="amber" />
        <StatCard label={t("activeReservations")} value={confirmedReservations} icon="approval" color="violet" suffix={`/ ${totalReservations}`} />
        <StatCard label={t("totalRevenue")} value={formatCurrency(paidRevenue)} icon="revenue" color="emerald" />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              {t("monthlyRevenueTrend")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("last6Months")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              {t("reservationStatus")}
            </CardTitle>
            <p className="text-xs text-stone-400">{t("bookingDistribution")}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <ReservationStatusDonutChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/add" className="flex w-full items-center gap-3">
            <Plus className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("addAccommodation")}</p>
              <p className="text-xs text-stone-500">{t("addAccommodationDesc")}</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/rooms" className="flex w-full items-center gap-3">
            <BedDouble className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("roomManagement")}</p>
              <p className="text-xs text-stone-500">{t("roomManagementDesc")}</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/reservations" className="flex w-full items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("reservations")}</p>
              <p className="text-xs text-stone-500">{t("reservationsDesc")}</p>
            </div>
          </Link>
        </Button>
      </div>

      {/* ── Properties Grid ── */}
      <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-lg font-semibold text-stone-900">{t("yourProperties")}</h2>
        <PropertySwitcher accommodations={ACCOMMODATIONS} />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ACCOMMODATIONS.map((accommodation) => (
            <AccommodationCard
              key={accommodation.id}
              accommodation={accommodation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
