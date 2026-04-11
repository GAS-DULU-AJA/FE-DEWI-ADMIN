import { notFound } from "next/navigation";
import {
  AccommodationPageHeader,
  getAccommodationById,
  getSubmissionEvents,
  PropertyDetailTabs,
  SubmissionDisclaimer,
  SubmissionStatusBadge,
  SubmissionTimeline,
} from "@/features/accommodation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SubmissionStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodation = getAccommodationById(id);

  if (!accommodation) {
    notFound();
  }

  const events = getSubmissionEvents(id);

  return (
    <div className="space-y-6">
      <AccommodationPageHeader
        title="Status Pengajuan Penginapan"
        description={accommodation.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penginapan", href: "/dashboard/accommodation" },
          { label: accommodation.name, href: `/dashboard/accommodation/${id}` },
          { label: "Status" },
        ]}
        backHref={`/dashboard/accommodation/${id}`}
      />

      <PropertyDetailTabs propertyId={id} activeKey="status" />

      <SubmissionDisclaimer />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Status Saat Ini</CardTitle>
          <SubmissionStatusBadge status={accommodation.submissionStatus} />
        </CardHeader>
        <CardContent>
          {accommodation.rejectionReason ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <p className="font-medium">Alasan penolakan/revisi:</p>
              <p className="mt-1">{accommodation.rejectionReason}</p>
            </div>
          ) : (
            <p className="text-sm text-stone-600">
              Pengajuan Anda sedang berjalan sesuai status saat ini. Perubahan status akan otomatis muncul di timeline.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline Verifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionTimeline events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
