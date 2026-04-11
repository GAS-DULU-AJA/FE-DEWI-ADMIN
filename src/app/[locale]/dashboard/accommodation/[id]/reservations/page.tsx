import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AccommodationPageHeader,
  PropertyDetailTabs,
  RefundDialog,
  getAccommodationById,
  getReservationsByAccommodationId,
} from "@/features/accommodation";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const RESERVATION_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Checked In", className: "bg-emerald-100 text-emerald-700" },
  checked_out: { label: "Completed", className: "bg-stone-100 text-stone-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  success: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
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
          <CardContent className="text-2xl font-semibold text-stone-900">{reservations.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Confirmed Guests</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-700">
            {reservations.filter((reservation) => reservation.status === "confirmed").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reservation Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">
            {formatCurrency(totalRevenue)}
          </CardContent>
        </Card>
      </div>

      {refundableReservation ? <RefundDialog amount={refundableReservation.totalPrice} /> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Timeline</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {reservations.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-stone-500">Belum ada reservasi untuk properti ini.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr>
                  {[
                    "Guest",
                    "Room",
                    "Check-In",
                    "Check-Out",
                    "Total",
                    "Reservation Status",
                    "Payment",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-2.5 text-left text-xs font-medium text-stone-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{reservation.guestName}</p>
                      <p className="text-xs text-stone-500">{reservation.guestEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">{reservation.roomName}</td>
                    <td className="px-4 py-3 text-xs text-stone-500">{formatDateShort(reservation.checkIn)}</td>
                    <td className="px-4 py-3 text-xs text-stone-500">{formatDateShort(reservation.checkOut)}</td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {formatCurrency(reservation.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={RESERVATION_STATUS_META[reservation.status].className}>
                        {RESERVATION_STATUS_META[reservation.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={PAYMENT_STATUS_META[reservation.paymentStatus].className}>
                        {PAYMENT_STATUS_META[reservation.paymentStatus].label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
