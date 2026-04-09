"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccommodationPageHeader, RoomStatusBadge } from "@/features/accommodation";
import { ACCOMMODATIONS, getAllRooms } from "@/features/accommodation";
import { formatCurrency } from "@/lib/utils";
import { RoomAvailabilityBarChart } from "@/features/accommodation/components/dashboard-charts";

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
          { label: "Penginapan", href: "/dashboard/penginapan" },
          { label: "Kamar" },
        ]}
        backHref="/dashboard/penginapan"
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
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {filteredRooms.length === 0 ? (
            <p className="py-10 text-center text-sm text-stone-400">
              Tidak ada data kamar untuk kombinasi filter yang dipilih.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr>
                  {["Kamar", "Kode", "Tipe", "Penginapan", "Kapasitas", "Harga / Malam", "Stok", "View", "Fasilitas", "Status"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-stone-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRooms.map((room) => {
                  const accommodation = ACCOMMODATIONS.find((item) => item.id === room.accommodationId);
                  const stockColor =
                    room.availableUnits === 0
                      ? "text-red-600"
                      : room.availableUnits < room.totalUnits
                        ? "text-amber-600"
                        : "text-emerald-700";
                  return (
                    <tr key={room.id} className="hover:bg-stone-50">
                      <td className="px-3 py-3">
                        <p className="font-medium text-stone-900">{room.name}</p>
                        <p className="text-xs text-stone-400">{room.bedType}</p>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-stone-500">{room.roomCode}</td>
                      <td className="px-3 py-3 text-xs text-stone-600">{room.type}</td>
                      <td className="px-3 py-3 text-xs text-stone-600 whitespace-nowrap">
                        {accommodation?.name ?? "-"}
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-stone-600">
                        {room.capacity} tamu
                      </td>
                      <td className="px-3 py-3 font-medium text-stone-900 whitespace-nowrap">
                        {formatCurrency(room.pricePerNight)}
                      </td>
                      <td className={`px-3 py-3 text-center font-semibold text-xs ${stockColor}`}>
                        {room.availableUnits}/{room.totalUnits}
                      </td>
                      <td className="px-3 py-3 text-xs text-stone-500">{room.view}</td>
                      <td className="px-3 py-3 text-xs text-stone-500 max-w-[160px]">
                        {room.amenities.join(", ")}
                      </td>
                      <td className="px-3 py-3">
                        <RoomStatusBadge status={room.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
