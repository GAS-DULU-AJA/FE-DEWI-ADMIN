"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { getExperienceById, getReservationsByExperienceId } from "@/features/experience/utils";
import { SpeakerCard } from "@/features/experience/components/speaker-card";
import { AttendeeTable } from "@/features/experience/components/attendee-table";
import { DocumentManager } from "@/features/experience/components/document-manager";
import { NotificationManager } from "@/features/experience/components/notification-manager";
import { formatCurrency } from "@/lib/utils";

export default function ExperienceDetailPage() {
  const t = useTranslations("village");
  const te = useTranslations("experience");
  const { id } = useParams<{ id: string }>();
  const item = getExperienceById(id);

  if (!item) {
    notFound();
  }

  const reservations = getReservationsByExperienceId(id);
  const isActive = item.status === "published" || item.status === "ticket_sales_open" || item.status === "ongoing";

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={item.name}
        description={item.shortDescription}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: item.name },
        ]}
        badge={
          <Badge variant={isActive ? "default" : "secondary"}>
            {te(`status.${item.status}`)}
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
          <p className="text-xs text-stone-500">{t("experiences.capacity")}</p>
          <p className="text-lg font-bold text-stone-900">{item.totalBookings}/{item.totalCapacity}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
          <p className="text-xs text-stone-500">{t("experiences.checkedIn")}</p>
          <p className="text-lg font-bold text-emerald-600">{item.totalCheckedIn}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
          <p className="text-xs text-stone-500">{t("experiences.noShow")}</p>
          <p className="text-lg font-bold text-red-600">{item.totalNoShow}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
          <p className="text-xs text-stone-500">{t("experiences.rating")}</p>
          <p className="text-lg font-bold text-amber-600">{item.averageRating}/5</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
          <p className="text-xs text-stone-500">{t("experiences.revenue")}</p>
          <p className="text-lg font-bold text-stone-900">{formatCurrency(item.monthlyRevenue)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("experiences.detailTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-stone-700">
          <p>{item.description}</p>
          <p><span className="font-medium">{te("categories." + item.category)}</span></p>
          <p><span className="font-medium">{t("experiences.scheduleLabel")}:</span> {new Date(item.scheduleStart).toLocaleString()} – {new Date(item.scheduleEnd).toLocaleString()}</p>
          <p><span className="font-medium">{t("experiences.contactPerson")}:</span> {item.contactPerson} · {item.contactPhone} · {item.contactEmail}</p>
          <p><span className="font-medium">{t("experiences.cancellationPolicy")}:</span> {item.cancellationPolicy}</p>
          {item.whatToBring && <p><span className="font-medium">{t("experiences.whatToBring")}:</span> {item.whatToBring}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("experiences.ticketTypes")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {item.ticketTypes.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-lg border border-stone-200 p-3 text-sm">
                <div>
                  <p className="font-medium text-stone-900">{ticket.name}</p>
                  <p className="text-xs text-stone-500">{ticket.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-stone-900">{formatCurrency(ticket.price)}</p>
                  <p className="text-xs text-stone-500">{ticket.sold}/{ticket.quota}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {item.speakers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">{t("experiences.speakersTitle")}</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {item.speakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      )}

      <AttendeeTable reservations={reservations} />
      <DocumentManager documents={item.documents} />
      <NotificationManager notifications={item.notifications} />
    </div>
  );
}
