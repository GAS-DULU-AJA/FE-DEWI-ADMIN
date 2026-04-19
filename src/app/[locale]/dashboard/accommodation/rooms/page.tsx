"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { RoomStatusBadge } from "@/features/accommodation/components/room-status-badge";
import { ACCOMMODATIONS } from "@/features/accommodation/mock-data";
import { getAllRooms } from "@/features/accommodation/utils";
import { formatCurrency } from "@/lib/utils";
import { RoomAvailabilityBarChart } from "@/features/accommodation/components/dashboard-charts";
import { Eye, Pencil, Trash2 } from "lucide-react";

type RoomRow = ReturnType<typeof getAllRooms>[number];

export default function KamarPage() {
  const searchParams = useSearchParams();
  const presetAccommodationId = searchParams.get("accommodationId") ?? "all";

  const [selectedAccommodationId, setSelectedAccommodationId] = useState(presetAccommodationId);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "available" | "booked" | "maintenance">("all");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000000);
  const [query, setQuery] = useState("");

  const rooms = getAllRooms();

  const filteredRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesAccommodation =
        selectedAccommodationId === "all" || room.accommodationId === selectedAccommodationId;
      const matchesStatus = selectedStatus === "all" || room.status === selectedStatus;
      const matchesPrice = room.pricePerNight >= priceMin && room.pricePerNight <= priceMax;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [room.name, room.roomCode, room.type, room.floor, room.view]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesAccommodation && matchesStatus && matchesPrice && matchesQuery;
    });
  }, [rooms, selectedAccommodationId, selectedStatus, priceMin, priceMax, query]);

  const roomsSummary = useMemo(() => {
    const totalUnits = filteredRooms.reduce((sum, room) => sum + room.totalUnits, 0);
    const totalAvailable = filteredRooms.reduce((sum, room) => sum + room.availableUnits, 0);

    return {
      roomTypes: filteredRooms.length,
      totalUnits,
      totalAvailable,
    };
  }, [filteredRooms]);

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Manajemen Kamar"
        description="Data kamar seluruh penginapan. Gunakan filter untuk melihat kamar berdasarkan penginapan, status, dan rentang harga."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: "Kamar" },
        ]}
        backHref="/dashboard/accommodation"
      />

      {/* ── Stok chart ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-stone-900">
            Stok & Ketersediaan Kamar Per Properti
          </CardTitle>
          <p className="text-xs text-stone-400">
            Unit tersedia (hijau), terisi (kuning), dalam pemeliharaan (merah)
          </p>
        </CardHeader>
        <CardContent className="pb-4 pr-2">
          <RoomAvailabilityBarChart />
        </CardContent>
      </Card>

      {/* ── Filters ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Kamar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Penginapan</label>
            <select
              value={selectedAccommodationId}
              onChange={(event) => setSelectedAccommodationId(event.target.value)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            >
              <option value="all">Semua Penginapan</option>
              {ACCOMMODATIONS.map((accommodation) => (
                <option key={accommodation.id} value={accommodation.id}>
                  {accommodation.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Status</label>
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value as "all" | "available" | "booked" | "maintenance")
              }
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="booked">Penuh Dipesan</option>
              <option value="maintenance">Perawatan</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Harga Minimum</label>
            <input
              type="number"
              min={0}
              value={priceMin}
              onChange={(event) => setPriceMin(Number(event.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Harga Maksimum</label>
            <input
              type="number"
              min={0}
              value={priceMax}
              onChange={(event) => setPriceMax(Number(event.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">Cari kamar</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nama, kode, tipe..."
              className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tipe Kamar</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{roomsSummary.roomTypes}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Unit</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">{roomsSummary.totalUnits}</CardContent>
        </Card>
        <Card>
          <CardHeader>
                <CardTitle className="text-sm">Unit Tersedia</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-700">{roomsSummary.totalAvailable}</CardContent>
        </Card>
      </div>

      {/* ── Tabel Kamar ── */}
      <DataTable<RoomRow>
        data={filteredRooms}
        columns={[
          {
            id: "name",
            header: "Kamar",
            accessorFn: (row) => (
              <div>
                <p className="font-medium text-stone-900">{row.name}</p>
                <p className="text-xs text-stone-400">{row.bedType}</p>
              </div>
            ),
            sortable: true,
          },
          { id: "roomCode", header: "Kode", accessorKey: "roomCode" as keyof RoomRow, className: "font-mono text-xs text-stone-500", hideOnMobile: true },
          { id: "type", header: "Tipe", accessorKey: "type" as keyof RoomRow, sortable: true, hideOnMobile: true },
          {
            id: "accommodation",
            header: "Penginapan",
            accessorFn: (row) => ACCOMMODATIONS.find((a) => a.id === row.accommodationId)?.name ?? "-",
            hideOnMobile: true,
          },
          {
            id: "capacity",
            header: "Kapasitas",
            accessorFn: (row) => `${row.capacity} tamu`,
            sortable: true,
            hideOnMobile: true,
          },
          {
            id: "price",
            header: "Harga / Malam",
            accessorFn: (row) => (
              <span className="font-medium text-stone-900 whitespace-nowrap">
                {formatCurrency(row.pricePerNight)}
              </span>
            ),
            sortable: true,
          },
          {
            id: "stock",
            header: "Stok",
            accessorFn: (row) => {
              const color =
                row.availableUnits === 0
                  ? "text-red-600"
                  : row.availableUnits < row.totalUnits
                    ? "text-amber-600"
                    : "text-emerald-700";
              return <span className={`font-semibold ${color}`}>{row.availableUnits}/{row.totalUnits}</span>;
            },
            sortable: true,
            hideOnMobile: true,
          },
          { id: "view", header: "View", accessorKey: "view" as keyof RoomRow, hideOnMobile: true },
          {
            id: "amenities",
            header: "Fasilitas",
            accessorFn: (row) => <span className="max-w-40 truncate">{row.amenities.join(", ")}</span>,
            hideOnMobile: true,
          },
          {
            id: "status",
            header: "Status",
            accessorFn: (row) => <RoomStatusBadge status={row.status} />,
            sortable: true,
          },
        ] satisfies ColumnDef<RoomRow>[]}
        keyExtractor={(row) => row.id}
        searchPlaceholder="Cari kamar..."
        searchableFields={["name" as keyof RoomRow, "roomCode" as keyof RoomRow, "type" as keyof RoomRow]}
        actions={(row) => [
          { label: "Lihat Detail", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
          { label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: () => {} },
          { label: "Hapus", icon: <Trash2 className="h-4 w-4" />, onClick: () => {}, variant: "destructive" },
        ]}
        emptyState={{
          title: "Tidak ada kamar ditemukan",
          description: "Tidak ada data kamar untuk kombinasi filter yang dipilih.",
        }}
      />
    </div>
  );
}
