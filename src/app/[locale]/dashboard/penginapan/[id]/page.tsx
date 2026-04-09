import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCOMMODATIONS,
  AccommodationPageHeader,
  getAccommodationById,
  getRoomsByAccommodationId,
  calculateOccupancyRate,
  PropertySwitcher,
  SubmissionStatusBadge,
} from "@/features/accommodation";
import { formatCurrency } from "@/lib/utils";

export default async function AccommodationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  const rooms = getRoomsByAccommodationId(id);
  const occupancyRate = calculateOccupancyRate(id);

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title={accommodation.name}
        description={`${accommodation.address}, ${accommodation.village}, ${accommodation.regency}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/penginapan" },
          { label: accommodation.name },
        ]}
        backHref="/dashboard/penginapan"
        badge={<SubmissionStatusBadge status={accommodation.submissionStatus} />}
      />

      <PropertySwitcher accommodations={ACCOMMODATIONS} />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>{accommodation.name}</CardTitle>
            <p className="mt-1 text-sm text-stone-500">
              {accommodation.address}, {accommodation.village}, {accommodation.regency}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-stone-600">{accommodation.description}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs text-stone-500">Total Kamar</p>
              <p className="mt-1 text-xl font-semibold text-stone-900">{rooms.length}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs text-stone-500">Occupancy Rate</p>
              <p className="mt-1 text-xl font-semibold text-stone-900">{occupancyRate}%</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs text-stone-500">Rentang Harga</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {formatCurrency(accommodation.priceRange.min)} - {formatCurrency(accommodation.priceRange.max)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/penginapan/${id}/status`}>Status Pengajuan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/penginapan/kamar?accommodationId=${id}`}>Manajemen Kamar</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/penginapan/reservasi?accommodationId=${id}`}>Manajemen Reservasi</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/penginapan/ulasan?accommodationId=${id}`}>Ulasan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/penginapan/${id}/keuangan`}>Keuangan</Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/penginapan/${id}/pengaturan`}>Pengaturan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
