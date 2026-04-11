import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Building2, Star, BedDouble } from "lucide-react";
import { SubmissionStatusBadge } from "./status-badge";
import { calculateOccupancyRate, getRoomsByAccommodationId } from "../utils";
import type { Accommodation } from "@/types";

export function AccommodationCard({
  accommodation,
}: {
  accommodation: Accommodation;
}) {
  const rooms = getRoomsByAccommodationId(accommodation.id);
  const occupancyRate = calculateOccupancyRate(accommodation.id);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{accommodation.name}</CardTitle>
            <p className="mt-1 text-xs text-stone-500">
              {accommodation.village}, {accommodation.regency}
            </p>
          </div>
          <SubmissionStatusBadge status={accommodation.submissionStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-stone-600">{accommodation.shortDescription}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
          <div className="rounded-lg bg-stone-50 p-2">
            <p className="text-[11px] text-stone-400">Kamar</p>
            <p className="mt-1 flex items-center gap-1 font-medium">
              <BedDouble className="h-3 w-3" /> {rooms.length}
            </p>
          </div>
          <div className="rounded-lg bg-stone-50 p-2">
            <p className="text-[11px] text-stone-400">Occupancy</p>
            <p className="mt-1 font-medium">{occupancyRate}%</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-2">
            <p className="text-[11px] text-stone-400">Rating</p>
            <p className="mt-1 flex items-center gap-1 font-medium">
              <Star className="h-3 w-3 text-amber-500" /> {accommodation.rating || "-"}
            </p>
          </div>
          <div className="rounded-lg bg-stone-50 p-2">
            <p className="text-[11px] text-stone-400">Harga</p>
            <p className="mt-1 font-medium">
              {formatCurrency(accommodation.priceRange.min)} - {formatCurrency(accommodation.priceRange.max)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" asChild>
            <Link href={`/dashboard/accommodation/${accommodation.id}`}>
              <Building2 className="h-3.5 w-3.5" />
              Buka Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/accommodation/${accommodation.id}/status`}>
              Lihat Status Pengajuan
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
