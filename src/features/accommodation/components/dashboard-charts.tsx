"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ACCOMMODATIONS, ACCOMMODATION_ROOMS } from "../mock-data";
import { getAllReservations } from "../utils";
import { formatCurrency } from "@/lib/utils";

// ── SSR guard ──────────────────────────────────────────────────
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div
      style={{ height }}
      className="animate-pulse rounded-lg bg-stone-100"
    />
  );
}

// ── Constants ──────────────────────────────────────────────────
const RESERVATION_STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  checked_in: "#10b981",
  checked_out: "#78716c",
  cancelled: "#ef4444",
};

const RESERVATION_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Aktif",
  checked_out: "Selesai",
  cancelled: "Dibatalkan",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  success: "#10b981",
  failed: "#ef4444",
  refunded: "#8b5cf6",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  success: "Lunas",
  failed: "Gagal",
  refunded: "Refunded",
};

const MONTHLY_REVENUE_DATA = [
  { bulan: "Nov'25", Pendapatan: 0 },
  { bulan: "Des'25", Pendapatan: 620000 },
  { bulan: "Jan'26", Pendapatan: 1100000 },
  { bulan: "Feb'26", Pendapatan: 1850000 },
  { bulan: "Mar'26", Pendapatan: 3050000 },
  { bulan: "Apr'26", Pendapatan: 5240000 },
];

// ── Data helpers ───────────────────────────────────────────────
function getRevenueByPropertyData() {
  const reservations = getAllReservations();
  return ACCOMMODATIONS.map((acc) => {
    const paidRevenue = reservations
      .filter((r) => r.accommodationId === acc.id && r.paymentStatus === "success")
      .reduce((sum, r) => sum + r.totalPrice, 0);
    // Short name: remove prefix type words
    const shortName = acc.name
      .replace(/^(Homestay|Villa|Guest\s*House)\s/i, "")
      .slice(0, 14);
    return { name: shortName, Pendapatan: paidRevenue };
  });
}

function getReservationStatusData() {
  const reservations = getAllReservations();
  const map: Record<string, number> = {};
  for (const r of reservations) {
    map[r.status] = (map[r.status] ?? 0) + 1;
  }
  return Object.entries(map).map(([key, value]) => ({
    key,
    name: RESERVATION_STATUS_LABELS[key] ?? key,
    value,
  }));
}

function getPaymentStatusData() {
  const reservations = getAllReservations();
  const map: Record<string, number> = {};
  for (const r of reservations) {
    map[r.paymentStatus] = (map[r.paymentStatus] ?? 0) + 1;
  }
  return Object.entries(map).map(([key, value]) => ({
    key,
    name: PAYMENT_STATUS_LABELS[key] ?? key,
    value,
  }));
}

function getRoomAvailabilityData() {
  return ACCOMMODATIONS.map((acc) => {
    const rooms = ACCOMMODATION_ROOMS.filter((r) => r.accommodationId === acc.id);
    const tersedia = rooms.reduce((sum, r) => sum + r.availableUnits, 0);
    const totalUnits = rooms.reduce((sum, r) => sum + r.totalUnits, 0);
    const pemeliharaan = rooms
      .filter((r) => r.status === "maintenance")
      .reduce((sum, r) => sum + r.totalUnits, 0);
    const terisi = Math.max(totalUnits - tersedia - pemeliharaan, 0);
    const shortName = acc.name
      .replace(/^(Homestay|Villa|Guest\s*House)\s/i, "")
      .slice(0, 14);
    return { name: shortName, Tersedia: tersedia, Terisi: terisi, Pemeliharaan: pemeliharaan };
  });
}

function getRoomTypeRevenueData() {
  const reservations = getAllReservations();
  const map: Record<string, number> = {};
  for (const r of reservations.filter((r) => r.paymentStatus === "success")) {
    const room = ACCOMMODATION_ROOMS.find((rm) => rm.id === r.roomId);
    if (room) {
      map[room.type] = (map[room.type] ?? 0) + r.totalPrice;
    }
  }
  return Object.entries(map)
    .map(([tipe, Pendapatan]) => ({ tipe, Pendapatan }))
    .sort((a, b) => b.Pendapatan - a.Pendapatan);
}

// ── Tooltip formatters ─────────────────────────────────────────
function formatYAxis(v: unknown): string {
  const n = Number(v);
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function legendFormatter(value: string) {
  return <span style={{ fontSize: "11px", color: "#57534e" }}>{value}</span>;
}

// ── Charts ─────────────────────────────────────────────────────

/** Tren Pendapatan Bulanan — bar chart, 6 bulan */
export function MonthlyRevenueTrendChart() {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={MONTHLY_REVENUE_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis dataKey="bulan" tick={{ fontSize: 10 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 9 }} width={38} />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Pendapatan"]}
        />
        <Bar dataKey="Pendapatan" fill="#6366f1" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Pendapatan Per Properti — bar chart */
export function RevenueByPropertyChart() {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton />;
  const data = getRevenueByPropertyData();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 9 }} width={38} />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Pendapatan"]}
        />
        <Bar dataKey="Pendapatan" fill="#10b981" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Status Reservasi — donut chart */
export function ReservationStatusDonutChart() {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton />;
  const data = getReservationStatusData();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="44%"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`res-status-${index}`}
              fill={RESERVATION_STATUS_COLORS[entry.key] ?? "#78716c"}
            />
          ))}
        </Pie>
        <Legend iconType="circle" iconSize={8} formatter={legendFormatter} />
        <Tooltip formatter={(value) => [String(value), "Reservasi"]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Status Pembayaran — donut chart */
export function PaymentStatusDonutChart() {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton />;
  const data = getPaymentStatusData();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="44%"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`pay-status-${index}`}
              fill={PAYMENT_STATUS_COLORS[entry.key] ?? "#78716c"}
            />
          ))}
        </Pie>
        <Legend iconType="circle" iconSize={8} formatter={legendFormatter} />
        <Tooltip formatter={(value) => [String(value), "Transaksi"]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Stok & Ketersediaan Kamar — stacked bar per properti */
export function RoomAvailabilityBarChart() {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton />;
  const data = getRoomAvailabilityData();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 9 }} width={24} allowDecimals={false} />
        <Tooltip />
        <Legend iconType="circle" iconSize={8} formatter={legendFormatter} />
        <Bar dataKey="Tersedia" stackId="stock" fill="#10b981" />
        <Bar dataKey="Terisi" stackId="stock" fill="#f59e0b" />
        <Bar dataKey="Pemeliharaan" stackId="stock" fill="#ef4444" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Pendapatan Per Tipe Kamar — horizontal bar chart */
export function RoomTypeRevenueChart() {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton />;
  const data = getRoomTypeRevenueData();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={formatYAxis}
          tick={{ fontSize: 9 }}
        />
        <YAxis type="category" dataKey="tipe" tick={{ fontSize: 10 }} width={80} />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Pendapatan"]}
        />
        <Bar dataKey="Pendapatan" fill="#3b82f6" radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
