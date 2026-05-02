"use client";

import { useMemo } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ACCOMMODATIONS,
} from "@/features/accommodation/mock-data";
import { VillageApprovalBanner } from "@/features/shared/components/village-approval-banner";
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
import type { Accommodation } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Plus, BedDouble, CheckCircle } from "lucide-react";

export default function PenginapanDashboard() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const router = useRouter();
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

  const columns = useMemo<ColumnDef<Accommodation>[]>(
    () => [
      {
        id: "name",
        header: "Property",
        accessorKey: "name",
        sortable: true,
      },
      {
        id: "village",
        header: "Location",
        accessorKey: "village",
        sortable: true,
      },
      {
        id: "submissionStatus",
        header: tc("status"),
        accessorKey: "submissionStatus",
        sortable: true,
        filterable: true,
        filterOptions: [
          { value: "draft", label: "Draft" },
          { value: "submitted", label: "Submitted" },
          { value: "revision", label: "Revision" },
          { value: "approved", label: "Approved" },
          { value: "suspended", label: "Suspended" },
        ],
      },
      {
        id: "published",
        header: "Visibility",
        accessorFn: (row) => (row.isPublished ? "Published" : "Draft"),
        sortable: true,
      },
      {
        id: "rating",
        header: "Rating",
        accessorFn: (row) => `${row.rating.toFixed(1)} / 5`,
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: "updatedAt",
        header: "Updated",
        accessorFn: (row) => formatDateShort(row.updatedAt),
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [tc],
  );

  const actions = (row: Accommodation): ActionItem[] => [
    {
      label: tc("view"),
      onClick: () => {
        router.push(`/dashboard/accommodation/${row.id}`);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {ACCOMMODATIONS[0] ? (
        <VillageApprovalBanner
          villageName={ACCOMMODATIONS[0].villageName}
          status={ACCOMMODATIONS[0].villageApprovalStatus}
          note={ACCOMMODATIONS[0].villageApprovalNote}
        />
      ) : null}

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
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("monthlyRevenueTrend")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("last6Months")}</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-on-surface">
              {t("reservationStatus")}
            </CardTitle>
            <p className="text-xs text-on-surface/40">{t("bookingDistribution")}</p>
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
              <p className="text-xs text-on-surface/60">{t("addAccommodationDesc")}</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/rooms" className="flex w-full items-center gap-3">
            <BedDouble className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("roomManagement")}</p>
              <p className="text-xs text-on-surface/60">{t("roomManagementDesc")}</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/reservations" className="flex w-full items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{t("reservations")}</p>
              <p className="text-xs text-on-surface/60">{t("reservationsDesc")}</p>
            </div>
          </Link>
        </Button>
      </div>

      {/* ── Properties Grid ── */}
      <div className="rounded-2xl border border-surface-container-high/80 bg-white/70 p-4 shadow-ambient sm:p-5">
        <h2 className="mb-4 text-lg font-semibold text-on-surface">{t("yourProperties")}</h2>
        <PropertySwitcher accommodations={ACCOMMODATIONS} />
        <div className="mt-4">
          <DataTable
            data={ACCOMMODATIONS}
            columns={columns}
            keyExtractor={(row) => row.id}
            searchableFields={["name", "village", "district", "regency"]}
            searchPlaceholder={`${tc("search")}...`}
            pageSize={10}
            actions={actions}
            mobileCardRenderer={(row) => <AccommodationCard accommodation={row} />}
          />
        </div>
      </div>
    </div>
  );
}
