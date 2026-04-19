"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FacilityAvailabilityCalendar } from "@/features/experience/components/facility-availability-calendar";
import { FacilityBrowser } from "@/features/experience/components/facility-browser";
import { useLocale } from "next-intl";

export type FacilityCatalogItem = {
  id: string;
  name: string;
  availability: "available" | "limited" | "unavailable";
  price: number;
};

export type FacilityReservationDraft = {
  facilityId: string;
  facilityName: string;
  usageDate: string;
  startTime: string;
  endTime: string;
  quantity: number;
  notes: string;
};

type FacilityReservationBlock = {
  facilityId: string;
  date: string;
  hours: number;
};

export function FacilityReservationSelector({
  targetVillage,
  catalog,
  reservations,
  selectedRequests,
  onAddFacility,
  onRemoveFacility,
  onUpdateFacility,
}: {
  targetVillage: string;
  catalog: FacilityCatalogItem[];
  reservations: FacilityReservationBlock[];
  selectedRequests: FacilityReservationDraft[];
  onAddFacility: (facility: FacilityCatalogItem) => void;
  onRemoveFacility: (facilityId: string) => void;
  onUpdateFacility: (facilityId: string, patch: Partial<FacilityReservationDraft>) => void;
}) {
  const locale = useLocale();
  const isId = locale === "id";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">{isId ? "Referensi wajib ke Reservations Workspace" : "Required Reservations Workspace reference"}</p>
        <p className="mt-1 text-emerald-800">
          {isId
            ? `Fasilitas untuk ${targetVillage || "desa tujuan"} hanya boleh dipilih dari inventaris reservasi desa.`
            : `Facilities for ${targetVillage || "the target village"} must be selected from the village reservation inventory.`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1.35fr]">
        <FacilityBrowser facilities={catalog} />
        <FacilityAvailabilityCalendar
          facilities={catalog.map((item) => ({ id: item.id, name: item.name }))}
          reservations={reservations}
          horizonDays={7}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isId ? "Pilih Fasilitas yang Digunakan" : "Select Facilities To Use"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {catalog.map((facility) => {
              const selected = selectedRequests.some((item) => item.facilityId === facility.id);
              const disabled = facility.availability === "unavailable";

              return (
                <div key={facility.id} className="rounded-xl border border-stone-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{facility.name}</p>
                      <p className="text-sm text-stone-500">
                        {isId ? "Biaya referensi" : "Reference fee"}: Rp {facility.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={selected ? "outline" : "default"}
                      disabled={disabled}
                      onClick={() => (selected ? onRemoveFacility(facility.id) : onAddFacility(facility))}
                    >
                      {selected ? (isId ? "Hapus" : "Remove") : (isId ? "Pilih" : "Select")}
                    </Button>
                  </div>
                  {disabled ? (
                    <p className="mt-3 text-xs text-red-600">
                      {isId ? "Tidak tersedia untuk proposal yang diajukan saat ini." : "Currently unavailable for this proposal."}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          {selectedRequests.length > 0 ? (
            <div className="space-y-3">
              {selectedRequests.map((request) => (
                <div key={request.facilityId} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{request.facilityName}</p>
                      <p className="text-xs text-stone-500">
                        {isId ? "Atur slot pemakaian untuk pengajuan approval." : "Set the usage slot for approval submission."}
                      </p>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => onRemoveFacility(request.facilityId)}>
                      {isId ? "Batalkan" : "Remove"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                      <Label>{isId ? "Tanggal Pemakaian" : "Usage Date"}</Label>
                      <Input
                        type="date"
                        value={request.usageDate}
                        onChange={(event) => onUpdateFacility(request.facilityId, { usageDate: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{isId ? "Jam Mulai" : "Start Time"}</Label>
                      <Input
                        type="time"
                        value={request.startTime}
                        onChange={(event) => onUpdateFacility(request.facilityId, { startTime: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{isId ? "Jam Selesai" : "End Time"}</Label>
                      <Input
                        type="time"
                        value={request.endTime}
                        onChange={(event) => onUpdateFacility(request.facilityId, { endTime: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{isId ? "Jumlah / Unit" : "Quantity / Units"}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={request.quantity}
                        onChange={(event) => onUpdateFacility(request.facilityId, { quantity: Number(event.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2 xl:col-span-4">
                      <Label>{isId ? "Catatan Operasional" : "Operational Notes"}</Label>
                      <Input
                        value={request.notes}
                        onChange={(event) => onUpdateFacility(request.facilityId, { notes: event.target.value })}
                        placeholder={
                          isId
                            ? "Contoh: butuh setup kursi, listrik tambahan, akses loading"
                            : "Example: chair setup, extra power, loading access"
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
              {isId
                ? "Belum ada fasilitas dipilih. Tambahkan minimal satu fasilitas desa untuk proposal yang membutuhkan venue atau aset desa."
                : "No facility selected yet. Add at least one village facility for proposals that use village venues or assets."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}