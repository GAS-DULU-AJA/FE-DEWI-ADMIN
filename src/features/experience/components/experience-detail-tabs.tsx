"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { TicketManager } from "@/features/experience/components/ticket-manager";
import { ItineraryBuilder } from "@/features/experience/components/itinerary-builder";
import { PosterUpload } from "@/features/experience/components/poster-upload";
import { SpeakerCard } from "@/features/experience/components/speaker-card";
import { DocumentManager } from "@/features/experience/components/document-manager";
import { NotificationManager } from "@/features/experience/components/notification-manager";
import { AttendeeTable } from "@/features/experience/components/attendee-table";
import type { ExperienceItem, ExperienceReservation } from "@/features/experience/types";

type DetailTab =
  | "overview"
  | "tickets"
  | "itinerary"
  | "speakers"
  | "attendees"
  | "documents"
  | "notifications"
  | "media";

export function ExperienceDetailTabs({
  experience,
  reservations,
}: {
  experience: ExperienceItem;
  reservations: ExperienceReservation[];
}) {
  const t = useTranslations("experience");
  const locale = useLocale();
  const isId = locale === "id";
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  const tabs = useMemo(
    () => [
      { key: "overview" as const, label: isId ? "Overview" : "Overview" },
      { key: "tickets" as const, label: isId ? "Tiket" : "Tickets" },
      { key: "itinerary" as const, label: t("components.itinerary") },
      { key: "speakers" as const, label: t("speakers.title") },
      { key: "attendees" as const, label: t("attendees.title") },
      { key: "documents" as const, label: t("documents.title") },
      { key: "notifications" as const, label: t("notifications.title") },
      { key: "media" as const, label: isId ? "Media" : "Media" },
    ],
    [isId, t]
  );

  return (
    <div className="space-y-4">
      <SegmentedTabs
        tabs={tabs.map((tab) => ({ id: tab.key, label: tab.label }))}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1 rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700">
              <p className="font-medium text-stone-900">{t("detail.eventInfo")}</p>
              <p>{t("detail.location")}: {experience.locationName}</p>
              <p>{t("detail.address")}: {experience.locationAddress}</p>
              <p>{t("detail.schedule")}: {new Date(experience.scheduleStart).toLocaleString()} - {new Date(experience.scheduleEnd).toLocaleString()}</p>
              <p>{t("detail.category")}: {t(`categories.${experience.category}`)}</p>
              <p>{t("detail.visibility")}: {t(`visibility.${experience.visibility}`)}</p>
              <p>{t("detail.locationType")}: {t(`locationType.${experience.locationType}`)}</p>
              {experience.onlineUrl && <p>{t("detail.onlineUrl")}: {experience.onlineUrl}</p>}
            </div>
            <div className="space-y-1 rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700">
              <p className="font-medium text-stone-900">{t("detail.contactInfo")}</p>
              <p>{t("detail.contactPerson")}: {experience.contactPerson}</p>
              <p>{t("detail.contactPhone")}: {experience.contactPhone}</p>
              <p>{t("detail.contactEmail")}: {experience.contactEmail}</p>
              <p>{t("detail.cancellationPolicy")}: {experience.cancellationPolicy}</p>
              {experience.whatToBring && <p>{t("detail.whatToBring")}: {experience.whatToBring}</p>}
              {experience.difficultyLevel && <p>{t("detail.difficulty")}: {t(`difficulty.${experience.difficultyLevel}`)}</p>}
              {experience.languages && <p>{t("detail.languages")}: {experience.languages.join(", ")}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
              <p className="text-xs text-stone-500">{t("detail.totalBookings")}</p>
              <p className="text-lg font-bold text-stone-900">{experience.totalBookings}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
              <p className="text-xs text-stone-500">{t("detail.checkedIn")}</p>
              <p className="text-lg font-bold text-emerald-600">{experience.totalCheckedIn}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
              <p className="text-xs text-stone-500">{t("detail.noShow")}</p>
              <p className="text-lg font-bold text-red-600">{experience.totalNoShow}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
              <p className="text-xs text-stone-500">{t("detail.rating")}</p>
              <p className="text-lg font-bold text-amber-600">{experience.averageRating}/5</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-3 text-center">
              <p className="text-xs text-stone-500">{t("detail.capacity")}</p>
              <p className="text-lg font-bold text-stone-900">{experience.totalBookings}/{experience.totalCapacity}</p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700">
            <p className="font-medium text-stone-900">{isId ? "Status Event" : "Event Status"}</p>
            <div className="mt-2">
              <Badge variant={experience.status === "ticket_sales_open" || experience.status === "published" ? "default" : "secondary"}>
                {t(`status.${experience.status}`)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tickets" && <TicketManager tickets={experience.ticketTypes} />}

      {activeTab === "itinerary" && <ItineraryBuilder items={experience.itinerary} />}

      {activeTab === "speakers" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">{t("speakers.sectionTitle")}</h2>
          {experience.speakers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {experience.speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600">
              {isId ? "Belum ada pembicara yang ditambahkan." : "No speakers added yet."}
            </div>
          )}
        </div>
      )}

      {activeTab === "attendees" && <AttendeeTable reservations={reservations} />}
      {activeTab === "documents" && <DocumentManager documents={experience.documents} />}
      {activeTab === "notifications" && <NotificationManager notifications={experience.notifications} />}
      {activeTab === "media" && <PosterUpload />}
    </div>
  );
}
