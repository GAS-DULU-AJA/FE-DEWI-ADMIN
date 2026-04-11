import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACCOMMODATIONS,
  AccommodationPageHeader,
  BankAccountForm,
  getAccommodationById,
  getBankAccountByAccommodationId,
  getPromotionsByAccommodationId,
  getRoomsByAccommodationId,
  getWithdrawalsByAccommodationId,
  calculateOccupancyRate,
  MediaGallery,
  PromotionCard,
  PropertyDetailTabs,
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
  const promotions = getPromotionsByAccommodationId(id);
  const bankAccount = getBankAccountByAccommodationId(id);
  const withdrawals = getWithdrawalsByAccommodationId(id);
  const pendingWithdrawals = withdrawals.filter((item) => item.status === "pending");

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title={accommodation.name}
        description={`${accommodation.address}, ${accommodation.village}, ${accommodation.regency}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: accommodation.name },
        ]}
        backHref="/dashboard/accommodation"
        badge={<SubmissionStatusBadge status={accommodation.submissionStatus} />}
      />

      <PropertySwitcher accommodations={ACCOMMODATIONS} />

      <PropertyDetailTabs propertyId={id} />

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
              <Link href={`/dashboard/accommodation/${id}/status`}>Status Pengajuan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/accommodation/${id}/rooms`}>Manajemen Kamar</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/accommodation/${id}/reservations`}>Manajemen Reservasi</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/accommodation/${id}/reviews`}>Ulasan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/accommodation/${id}/finance`}>Keuangan</Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/accommodation/${id}/settings`}>Pengaturan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <MediaGallery images={accommodation.images} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Promotion & Payout Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-600">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-wide text-stone-500">Active Promotions</p>
              <p className="mt-1 text-2xl font-semibold text-stone-900">
                {promotions.filter((promotion) => promotion.status === "active").length}
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-wide text-stone-500">Pending Withdrawals</p>
              <p className="mt-1 text-2xl font-semibold text-stone-900">{pendingWithdrawals.length}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-wide text-stone-500">Primary Account</p>
              <p className="mt-1 font-semibold text-stone-900">{bankAccount?.bankName ?? "No bank account"}</p>
              <p>{bankAccount?.accountHolderName ?? "Add a payout account in finance settings."}</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard/accommodation/promotions">Open Promotions Center</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {promotions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Promotions for This Property</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {promotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        </div>
      ) : null}

      {bankAccount ? <BankAccountForm account={bankAccount} /> : null}
    </div>
  );
}
