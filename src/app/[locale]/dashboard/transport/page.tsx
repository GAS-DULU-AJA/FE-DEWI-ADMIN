"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  Car,
  TrendingUp,
  Users,
  Star,
  ClipboardList,
  Truck,
  MapPin,
  Percent,
} from "lucide-react";
import { MOCK_TRANSPORT_STATS, MOCK_TRANSPORT_BOOKINGS } from "@/features/transport/mock-data";
import { VillageApprovalBanner } from "@/features/shared/components/village-approval-banner";

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-surface-container-lowest shadow-ambient p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-body text-on-surface/60">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-on-surface">{value}</p>
      {sub && <p className="mt-1 text-xs font-body text-on-surface/50">{sub}</p>}
    </div>
  );
}

export default function TransportDashboardPage() {
  const locale = useLocale();
  const isId = locale === "id";
  const stats = MOCK_TRANSPORT_STATS;

  return (
    <div className="space-y-6">
      <VillageApprovalBanner status="approved" villageName="Desa Wisata Sari Alam" />

      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          {isId ? "Dashboard Transport" : "Transport Dashboard"}
        </h1>
        <p className="mt-1 text-sm font-body text-on-surface/60">
          {isId ? "Ringkasan operasional armada & pemesanan" : "Fleet & booking operations overview"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={isId ? "Total Pemesanan" : "Total Bookings"}
          value={stats.totalBookings}
          sub={isId ? `${stats.pendingBookings} menunggu konfirmasi` : `${stats.pendingBookings} pending`}
          icon={<ClipboardList className="h-4 w-4 text-sky-600" />}
          color="bg-sky-100"
        />
        <StatCard
          label={isId ? "Pendapatan Bulan Ini" : "Monthly Revenue"}
          value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}jt`}
          sub={isId ? "Trip selesai: " + stats.completedTrips : "Completed trips: " + stats.completedTrips}
          icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          color="bg-emerald-100"
        />
        <StatCard
          label={isId ? "Utilisasi Armada" : "Fleet Utilization"}
          value={`${stats.utilizationPercent}%`}
          sub={isId ? `${stats.activeVehicles} kendaraan aktif` : `${stats.activeVehicles} active vehicles`}
          icon={<Percent className="h-4 w-4 text-amber-600" />}
          color="bg-amber-100"
        />
        <StatCard
          label="Rating"
          value={stats.avgRating.toFixed(1)}
          sub={isId ? `${stats.activeDrivers} supir aktif` : `${stats.activeDrivers} active drivers`}
          icon={<Star className="h-4 w-4 text-violet-600" />}
          color="bg-violet-100"
        />
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl bg-surface-container-lowest shadow-ambient overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
          <h2 className="font-display text-base font-semibold text-on-surface">
            {isId ? "Pemesanan Terbaru" : "Recent Bookings"}
          </h2>
        </div>
        <div className="divide-y divide-surface-container-low">
          {MOCK_TRANSPORT_BOOKINGS.map((booking) => (
            <div key={booking.id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 shrink-0">
                <Car className="h-5 w-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-on-surface truncate">
                  {booking.customerName}
                </p>
                <p className="text-xs font-body text-on-surface/50 truncate">
                  {booking.pickupLocation} → {booking.dropoffLocation}
                </p>
                <p className="text-xs font-body text-on-surface/40">
                  {booking.pickupDate} · {booking.passengers} pax
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                  booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                  booking.status === "completed" ? "bg-blue-100 text-blue-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {booking.status}
                </span>
                <p className="mt-1 text-xs font-body text-on-surface/60">
                  Rp {booking.totalPrice.toLocaleString("id")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
