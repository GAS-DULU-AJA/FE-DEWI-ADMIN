"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, TrendingUp, Users, BedDouble, CheckCircle } from "lucide-react";

export default function PenginapanDashboard() {
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
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard Penginapan</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Kelola seluruh properti penginapan, kamar, reservasi, dan performa occupancy
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-stone-500">Properti Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{activeProperties}</p>
            <p className="mt-1 text-xs text-stone-400">dari {totalProperties} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-stone-500">Total Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{totalRooms}</p>
            <p className="mt-1 text-xs text-stone-400">{totalUnits} unit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-stone-500">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{avgOccupancy}%</p>
            <p className="mt-1 text-xs text-stone-400">rata-rata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-stone-500">Reservasi Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-violet-600">{confirmedReservations}</p>
            <p className="mt-1 text-xs text-stone-400">dari {totalReservations} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-stone-500">Revenue (Lunas)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-stone-900">
              {formatCurrency(paidRevenue).split(",")[0].slice(0, -3)}
            </p>
            <p className="mt-1 text-xs text-stone-400">yang sudah settled</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Tren Pendapatan Bulanan
            </CardTitle>
            <p className="text-xs text-stone-400">Riwayat 6 bulan terakhir</p>
          </CardHeader>
          <CardContent className="pb-4 pr-2">
            <MonthlyRevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-stone-900">
              Status Reservasi
            </CardTitle>
            <p className="text-xs text-stone-400">Distribusi status booking</p>
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
              <p className="text-sm font-medium">Ajukan Penginapan</p>
              <p className="text-xs text-stone-500">Tambah properti baru</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/rooms" className="flex w-full items-center gap-3">
            <BedDouble className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Manajemen Kamar</p>
              <p className="text-xs text-stone-500">Kelola tipe & stok kamar</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto flex-col items-start p-4" variant="outline">
          <Link href="/dashboard/accommodation/reservations" className="flex w-full items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Reservasi</p>
              <p className="text-xs text-stone-500">Lihat semua booking</p>
            </div>
          </Link>
        </Button>
      </div>

      {/* ── Properties Grid ── */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">Properti Penginapan Anda</h2>
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
