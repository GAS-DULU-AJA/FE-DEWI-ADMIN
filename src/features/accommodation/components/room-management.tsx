"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type ColumnDef, type ActionItem } from "@/components/ui/data-table";
import { cn, formatCurrency } from "@/lib/utils";
import type { Room, RoomStatus } from "@/types";
import {
  CheckCircle2,
  DoorOpen,
  Pencil,
  Plus,
  Settings2,
} from "lucide-react";
import { RoomStatusBadge } from "./room-status-badge";

type RoomManagementProps = {
  accommodationId: string;
  accommodationName: string;
  initialRooms: Room[];
};

type RoomFormState = {
  name: string;
  roomCode: string;
  type: string;
  description: string;
  bedType: string;
  capacity: number;
  pricePerNight: number;
  sizeSqm: number;
  totalUnits: number;
  availableUnits: number;
  status: RoomStatus;
  floor: string;
  view: string;
  amenities: string;
  breakfastIncluded: boolean;
  smokingAllowed: boolean;
  maintenanceNote: string;
  lastCleanedAt: string;
};

const ROOM_TYPE_OPTIONS = [
  "Standard",
  "Standard Double",
  "Deluxe",
  "Deluxe Twin",
  "Suite",
  "Family Suite",
  "Loft",
  "Capsule",
  "Villa Room",
];

const STATUS_OPTIONS: Array<{ value: RoomStatus; label: string }> = [
  { value: "available", label: "Tersedia" },
  { value: "booked", label: "Penuh Dipesan" },
  { value: "maintenance", label: "Perawatan" },
];

function toFormState(room?: Room): RoomFormState {
  return {
    name: room?.name ?? "",
    roomCode: room?.roomCode ?? "",
    type: room?.type ?? "Standard",
    description: room?.description ?? "",
    bedType: room?.bedType ?? "",
    capacity: room?.capacity ?? 2,
    pricePerNight: room?.pricePerNight ?? 300000,
    sizeSqm: room?.sizeSqm ?? 20,
    totalUnits: room?.totalUnits ?? 1,
    availableUnits: room?.availableUnits ?? 1,
    status: room?.status ?? "available",
    floor: room?.floor ?? "Lantai 1",
    view: room?.view ?? "Halaman",
    amenities: room?.amenities.join(", ") ?? "",
    breakfastIncluded: room?.breakfastIncluded ?? false,
    smokingAllowed: room?.smokingAllowed ?? false,
    maintenanceNote: room?.maintenanceNote ?? "",
    lastCleanedAt: room?.lastCleanedAt?.slice(0, 10) ?? "",
  };
}

function nextStatus(status: RoomStatus): RoomStatus {
  if (status === "available") return "booked";
  if (status === "booked") return "maintenance";
  return "available";
}

export function RoomManagement({
  accommodationId,
  accommodationName,
  initialRooms,
}: RoomManagementProps) {
  const [rooms, setRooms] = useState(initialRooms);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [formState, setFormState] = useState<RoomFormState>(() => toFormState());
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormState, string>>>({});

  const summary = useMemo(() => {
    const totalTypes = rooms.length;
    const totalInventory = rooms.reduce((sum, room) => sum + room.totalUnits, 0);
    const availableInventory = rooms.reduce((sum, room) => sum + room.availableUnits, 0);
    const maintenanceInventory = rooms
      .filter((room) => room.status === "maintenance")
      .reduce((sum, room) => sum + room.totalUnits, 0);

    return {
      totalTypes,
      totalInventory,
      availableInventory,
      maintenanceInventory,
    };
  }, [rooms]);

  const editingRoom = useMemo(
    () => rooms.find((room) => room.id === editingRoomId),
    [rooms, editingRoomId]
  );

  const columns = useMemo((): ColumnDef<Room>[] => [
    {
      id: "name",
      header: "Kamar",
      accessorKey: "name",
      sortable: true,
      accessorFn: (room) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-on-surface">{room.name}</span>
          <Badge variant="outline">{room.roomCode}</Badge>
          <RoomStatusBadge status={room.status} />
        </div>
      ),
    },
    {
      id: "type",
      header: "Tipe",
      accessorKey: "type",
      sortable: true,
      filterable: true,
      hideOnMobile: true,
    },
    {
      id: "pricePerNight",
      header: "Harga/malam",
      accessorKey: "pricePerNight",
      sortable: true,
      accessorFn: (room) => <span className="font-medium text-on-surface">{formatCurrency(room.pricePerNight)}</span>,
    },
    {
      id: "capacity",
      header: "Kapasitas",
      accessorKey: "capacity",
      sortable: true,
      hideOnMobile: true,
      accessorFn: (room) => <span>{room.capacity} tamu</span>,
    },
    {
      id: "inventory",
      header: "Inventaris",
      accessorKey: "totalUnits",
      sortable: true,
      accessorFn: (room) => (
        <span className={room.availableUnits === 0 ? "text-red-600 font-medium" : "text-primary font-medium"}>
          {room.availableUnits}/{room.totalUnits}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: "available", label: "Tersedia" },
        { value: "booked", label: "Penuh Dipesan" },
        { value: "maintenance", label: "Perawatan" },
      ],
      hideOnMobile: true,
      accessorFn: (room) => <RoomStatusBadge status={room.status} />,
    },
  ], []);

  const roomActions = (room: Room): ActionItem[] => [
    { label: "Edit", icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => startEdit(room) },
    { label: "Ubah Status", icon: <Settings2 className="h-3.5 w-3.5" />, onClick: () => updateRoomStatus(room.id) },
  ];

  const roomMobileCard = (room: Room, actions?: ActionItem[]) => {
    const occupiedUnits = room.totalUnits - room.availableUnits;
    const occupancyPercent = room.totalUnits > 0 ? Math.round((occupiedUnits / room.totalUnits) * 100) : 0;
    return (
      <div className="space-y-2 p-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-on-surface">{room.name}</span>
              <Badge variant="outline">{room.roomCode}</Badge>
            </div>
            <p className="text-xs text-on-surface/60">{room.type} · {room.bedType} · {room.floor}</p>
          </div>
          <RoomStatusBadge status={room.status} />
        </div>
        <p className="text-sm font-medium text-on-surface">{formatCurrency(room.pricePerNight)}/malam</p>
        <div className="h-1.5 rounded-full bg-surface-container">
          <div
            className={cn("h-1.5 rounded-full", room.status === "maintenance" ? "bg-red-500" : room.status === "booked" ? "bg-amber-500" : "bg-primary")}
            style={{ width: `${Math.min(100, Math.max(8, occupancyPercent || 8))}%` }}
          />
        </div>
        <div className="flex gap-2">
          {actions?.map((a) => (
            <Button key={a.label} variant="outline" size="sm" onClick={a.onClick}>{a.label}</Button>
          ))}
        </div>
      </div>
    );
  };

  function resetForm(room?: Room) {
    setErrors({});
    setFormState(toFormState(room));
  }

  function startCreate() {
    setEditingRoomId(null);
    resetForm();
  }

  function startEdit(room: Room) {
    setEditingRoomId(room.id);
    resetForm(room);
  }

  function validateForm() {
    const nextErrors: Partial<Record<keyof RoomFormState, string>> = {};

    if (!formState.name.trim()) nextErrors.name = "Nama kamar wajib diisi.";
    if (!formState.roomCode.trim()) nextErrors.roomCode = "Kode kamar wajib diisi.";
    if (formState.pricePerNight <= 0) nextErrors.pricePerNight = "Harga harus lebih dari 0.";
    if (formState.totalUnits <= 0) nextErrors.totalUnits = "Minimal 1 unit kamar.";
    if (formState.availableUnits < 0) nextErrors.availableUnits = "Tidak boleh negatif.";
    if (formState.availableUnits > formState.totalUnits) {
      nextErrors.availableUnits = "Unit tersedia tidak boleh melebihi total unit.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const baseRoom: Room = {
      id: editingRoom?.id ?? `room-${Date.now()}`,
      accommodationId,
      name: formState.name.trim(),
      roomCode: formState.roomCode.trim().toUpperCase(),
      type: formState.type,
      description: formState.description.trim(),
      bedType: formState.bedType.trim(),
      capacity: formState.capacity,
      pricePerNight: formState.pricePerNight,
      sizeSqm: formState.sizeSqm,
      totalUnits: formState.totalUnits,
      availableUnits:
        formState.status === "available"
          ? formState.availableUnits
          : 0,
      status: formState.status,
      floor: formState.floor.trim(),
      view: formState.view.trim(),
      images: editingRoom?.images ?? [],
      amenities: formState.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      breakfastIncluded: formState.breakfastIncluded,
      smokingAllowed: formState.smokingAllowed,
      lastCleanedAt: formState.lastCleanedAt || undefined,
      maintenanceNote:
        formState.status === "maintenance" && formState.maintenanceNote.trim()
          ? formState.maintenanceNote.trim()
          : undefined,
    };

    setRooms((currentRooms) => {
      if (editingRoom) {
        return currentRooms.map((room) => (room.id === editingRoom.id ? baseRoom : room));
      }

      return [baseRoom, ...currentRooms];
    });

    startCreate();
  }

  function updateRoomStatus(roomId: string) {
    setRooms((currentRooms) =>
      currentRooms.map((room) => {
        if (room.id !== roomId) return room;

        const updatedStatus = nextStatus(room.status);
        return {
          ...room,
          status: updatedStatus,
          availableUnits:
            updatedStatus === "available"
              ? Math.max(1, Math.min(room.totalUnits, room.availableUnits || room.totalUnits))
              : 0,
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/200 bg-primary/10/70">
        <CardContent className="p-6">
          <div>
            <p className="text-sm font-medium text-primary">Operasional Kamar {accommodationName}</p>
            <p className="mt-1 text-sm text-primary">
              Kelola inventaris, harga, kapasitas, fasilitas, dan status operasional tiap tipe kamar dalam satu layar.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tipe Kamar</CardDescription>
            <CardTitle className="text-2xl">{summary.totalTypes}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Inventaris Unit</CardDescription>
            <CardTitle className="text-2xl">{summary.totalInventory}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unit Siap Jual</CardDescription>
            <CardTitle className="text-2xl text-primary">{summary.availableInventory}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unit Perawatan</CardDescription>
            <CardTitle className="text-2xl text-red-600">{summary.maintenanceInventory}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daftar Kamar</CardTitle>
              <CardDescription>
                Gunakan pencarian dan filter status untuk memeriksa kesiapan inventaris kamar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={rooms}
                columns={columns}
                keyExtractor={(r) => r.id}
                searchableFields={["name", "roomCode", "type", "floor"]}
                searchPlaceholder="Cari nama, kode, tipe..."
                pageSize={10}
                actions={roomActions}
                mobileCardRenderer={roomMobileCard}
                emptyState={{
                  title: "Tidak ada kamar",
                  description: "Tambahkan tipe kamar baru menggunakan form di samping.",
                }}
                toolbarExtra={
                  <Button size="sm" onClick={startCreate}>
                    <Plus className="h-4 w-4" />
                    Tambah Kamar
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle className="text-base">
                {editingRoom ? `Edit Kamar: ${editingRoom.name}` : "Tambah Tipe Kamar Baru"}
              </CardTitle>
              <CardDescription>
                Simpan detail komersial dan operasional tiap tipe kamar agar tim reservasi dan operasional sinkron.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Nama kamar</Label>
                    <Input
                      id="room-name"
                      value={formState.name}
                      onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                      error={errors.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-code">Kode kamar</Label>
                    <Input
                      id="room-code"
                      value={formState.roomCode}
                      onChange={(event) => setFormState((current) => ({ ...current, roomCode: event.target.value }))}
                      error={errors.roomCode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-type">Tipe kamar</Label>
                    <select
                      id="room-type"
                      value={formState.type}
                      onChange={(event) => setFormState((current) => ({ ...current, type: event.target.value }))}
                      className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {ROOM_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-status">Status</Label>
                    <select
                      id="room-status"
                      value={formState.status}
                      onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value as RoomStatus }))}
                      className="h-10 w-full rounded-lg border border-surface-container-high bg-surface-container-lowest px-3 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2 xl:col-span-1">
                    <Label htmlFor="room-description">Deskripsi</Label>
                    <Textarea
                      id="room-description"
                      rows={4}
                      value={formState.description}
                      onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-bed-type">Konfigurasi ranjang</Label>
                    <Input
                      id="room-bed-type"
                      value={formState.bedType}
                      onChange={(event) => setFormState((current) => ({ ...current, bedType: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-view">View</Label>
                    <Input
                      id="room-view"
                      value={formState.view}
                      onChange={(event) => setFormState((current) => ({ ...current, view: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-capacity">Kapasitas tamu</Label>
                    <Input
                      id="room-capacity"
                      type="number"
                      min={1}
                      value={formState.capacity}
                      onChange={(event) => setFormState((current) => ({ ...current, capacity: Number(event.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-price">Harga per malam</Label>
                    <Input
                      id="room-price"
                      type="number"
                      min={0}
                      value={formState.pricePerNight}
                      onChange={(event) => setFormState((current) => ({ ...current, pricePerNight: Number(event.target.value) || 0 }))}
                      error={errors.pricePerNight}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-size">Ukuran (m2)</Label>
                    <Input
                      id="room-size"
                      type="number"
                      min={1}
                      value={formState.sizeSqm}
                      onChange={(event) => setFormState((current) => ({ ...current, sizeSqm: Number(event.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-floor">Lokasi lantai</Label>
                    <Input
                      id="room-floor"
                      value={formState.floor}
                      onChange={(event) => setFormState((current) => ({ ...current, floor: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-total-units">Total unit</Label>
                    <Input
                      id="room-total-units"
                      type="number"
                      min={1}
                      value={formState.totalUnits}
                      onChange={(event) => setFormState((current) => ({ ...current, totalUnits: Number(event.target.value) || 0 }))}
                      error={errors.totalUnits}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-available-units">Unit tersedia</Label>
                    <Input
                      id="room-available-units"
                      type="number"
                      min={0}
                      value={formState.availableUnits}
                      onChange={(event) => setFormState((current) => ({ ...current, availableUnits: Number(event.target.value) || 0 }))}
                      error={errors.availableUnits}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 xl:col-span-1">
                    <Label htmlFor="room-amenities">Fasilitas kamar</Label>
                    <Textarea
                      id="room-amenities"
                      rows={3}
                      value={formState.amenities}
                      onChange={(event) => setFormState((current) => ({ ...current, amenities: event.target.value }))}
                      placeholder="Pisahkan dengan koma: AC, WiFi, TV"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-last-cleaned">Terakhir dibersihkan</Label>
                    <Input
                      id="room-last-cleaned"
                      type="date"
                      value={formState.lastCleanedAt}
                      onChange={(event) => setFormState((current) => ({ ...current, lastCleanedAt: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 xl:col-span-1">
                    <Label htmlFor="room-maintenance-note">Catatan perawatan</Label>
                    <Textarea
                      id="room-maintenance-note"
                      rows={3}
                      value={formState.maintenanceNote}
                      onChange={(event) => setFormState((current) => ({ ...current, maintenanceNote: event.target.value }))}
                      placeholder="Opsional, hanya untuk kamar status perawatan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-lg border border-surface-container-high px-3 py-2 text-sm text-on-surface/80">
                    <input
                      type="checkbox"
                      checked={formState.breakfastIncluded}
                      onChange={(event) => setFormState((current) => ({ ...current, breakfastIncluded: event.target.checked }))}
                    />
                    Sarapan termasuk
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-surface-container-high px-3 py-2 text-sm text-on-surface/80">
                    <input
                      type="checkbox"
                      checked={formState.smokingAllowed}
                      onChange={(event) => setFormState((current) => ({ ...current, smokingAllowed: event.target.checked }))}
                    />
                    Izinkan merokok
                  </label>
                </div>

                <div className="rounded-lg bg-surface-container-low p-3 text-xs text-on-surface/70">
                  <p className="font-medium text-on-surface">Ringkasan draft kamar</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <span>Potensi omzet / malam</span>
                    <span className="text-right font-medium text-on-surface">
                      {formatCurrency(formState.pricePerNight * Math.max(formState.totalUnits, 0))}
                    </span>
                    <span>Unit dapat dijual</span>
                    <span className="text-right font-medium text-on-surface">{formState.availableUnits} unit</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => resetForm(editingRoom)}>
                    Reset
                  </Button>
                  {editingRoom ? (
                    <Button type="button" variant="outline" onClick={startCreate}>
                      Mode Tambah
                    </Button>
                  ) : null}
                  <Button type="submit">
                    {editingRoom ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Simpan Perubahan
                      </>
                    ) : (
                      <>
                        <DoorOpen className="h-4 w-4" />
                        Simpan Kamar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}