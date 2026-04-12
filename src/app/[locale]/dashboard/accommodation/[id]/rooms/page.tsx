import { notFound } from "next/navigation";
import { AccommodationPageHeader } from "@/features/accommodation/components/page-header";
import { PropertyDetailTabs } from "@/features/accommodation/components/property-detail-tabs";
import { RoomManagement } from "@/features/accommodation/components/room-management";
import { getAccommodationById, getRoomsByAccommodationId } from "@/features/accommodation/utils";

export default async function PropertyRoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Room Management"
        description={accommodation.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: accommodation.name, href: `/dashboard/accommodation/${id}` },
          { label: "Rooms" },
        ]}
        backHref={`/dashboard/accommodation/${id}`}
      />

      <PropertyDetailTabs propertyId={id} activeKey="rooms" />

      <RoomManagement
        accommodationId={id}
        accommodationName={accommodation.name}
        initialRooms={getRoomsByAccommodationId(id)}
      />
    </div>
  );
}
