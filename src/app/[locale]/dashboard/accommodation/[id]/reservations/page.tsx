import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { PropertyReservationsTable } from "@/features/accommodation/components/property-reservations-table";
import { PropertyDetailTabs } from "@/features/accommodation/components/property-detail-tabs";
import { RefundDialog } from "@/features/accommodation/components/refund-dialog";
import { getAccommodationById, getReservationsByAccommodationId } from "@/features/accommodation/utils";
import { formatCurrency } from "@/lib/utils";

const RESERVATION_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Checked In", className: "bg-primary/10 text-primary" },
  checked_out: { label: "Completed", className: "bg-surface-container text-on-surface/80" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  success: { label: "Paid", className: "bg-primary/10 text-primary" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", className: "bg-violet-100 text-violet-700" },
};

export default async function PropertyReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  const reservations = getReservationsByAccommodationId(id);
  const totalRevenue = reservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
  const refundableReservation =
    reservations.find((reservation) => reservation.paymentStatus === "success") ?? reservations[0];

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Property Reservations"
        description={accommodation.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: accommodation.name, href: `/dashboard/accommodation/${id}` },
          { label: "Reservations" },
        ]}
        backHref={`/dashboard/accommodation/${id}`}
      />

      <PropertyDetailTabs propertyId={id} activeKey="reservations" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Reservations</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">{reservations.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Confirmed Guests</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-primary">
            {reservations.filter((reservation) => reservation.status === "confirmed").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reservation Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">
            {formatCurrency(totalRevenue)}
          </CardContent>
        </Card>
      </div>

      {refundableReservation ? <RefundDialog amount={refundableReservation.totalPrice} /> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyReservationsTable reservations={reservations} />
        </CardContent>
      </Card>
    </div>
  );
}
