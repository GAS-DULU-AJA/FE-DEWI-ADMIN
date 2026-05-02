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
import { ExperienceStaffManager } from "@/features/experience/components/experience-staff-manager";
import type { ExperienceItem, ExperienceReservation } from "@/features/experience/types";

type DetailTab =
  | "overview"
  | "tickets"
  | "itinerary"
  | "speakers"
  | "staff"
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
      { key: "staff" as const, label: isId ? "Pelaksana" : "Staff" },
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
            <div className="space-y-1 rounded-lg border border-surface-container-high bg-surface-container-lowest p-4 text-sm text-on-surface/80">
              <p className="font-medium text-on-surface">{t("detail.eventInfo")}</p>
              <p>{t("detail.location")}: {experience.locationName}</p>
              <p>{t("detail.address")}: {experience.locationAddress}</p>
              <p>{t("detail.schedule")}: {new Date(experience.scheduleStart).toLocaleString()} - {new Date(experience.scheduleEnd).toLocaleString()}</p>
              <p>{t("detail.category")}: {t(`categories.${experience.category}`)}</p>
              <p>{t("detail.visibility")}: {t(`visibility.${experience.visibility}`)}</p>
              <p>{t("detail.locationType")}: {t(`locationType.${experience.locationType}`)}</p>
              {experience.onlineUrl && <p>{t("detail.onlineUrl")}: {experience.onlineUrl}</p>}
            </div>
            <div className="space-y-1 rounded-lg border border-surface-container-high bg-surface-container-lowest p-4 text-sm text-on-surface/80">
              <p className="font-medium text-on-surface">{t("detail.contactInfo")}</p>
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
            <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-center">
              <p className="text-xs text-on-surface/60">{t("detail.totalBookings")}</p>
              <p className="text-lg font-bold text-on-surface">{experience.totalBookings}</p>
            </div>
            <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-center">
              <p className="text-xs text-on-surface/60">{t("detail.checkedIn")}</p>
              <p className="text-lg font-bold text-primary">{experience.totalCheckedIn}</p>
            </div>
            <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-center">
              <p className="text-xs text-on-surface/60">{t("detail.noShow")}</p>
              <p className="text-lg font-bold text-red-600">{experience.totalNoShow}</p>
            </div>
            <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-center">
              <p className="text-xs text-on-surface/60">{t("detail.rating")}</p>
              <p className="text-lg font-bold text-amber-600">{experience.averageRating}/5</p>
            </div>
            <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-center">
              <p className="text-xs text-on-surface/60">{t("detail.capacity")}</p>
              <p className="text-lg font-bold text-on-surface">{experience.totalBookings}/{experience.totalCapacity}</p>
            </div>
          </div>

          <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-4 text-sm text-on-surface/80">
            <p className="font-medium text-on-surface">{isId ? "Status Event" : "Event Status"}</p>
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
          <h2 className="text-lg font-semibold text-on-surface">{t("speakers.sectionTitle")}</h2>
          {experience.speakers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {experience.speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-surface-container-high bg-surface-container-lowest p-4 text-sm text-on-surface/70">
              {isId ? "Belum ada pembicara yang ditambahkan." : "No speakers added yet."}
            </div>
          )}
        </div>
      )}

      {activeTab === "staff" && <ExperienceStaffManager isId={isId} />}

      {activeTab === "attendees" && <AttendeeTable reservations={reservations} />}
      {activeTab === "documents" && <DocumentManager documents={experience.documents} />}
      {activeTab === "notifications" && <NotificationManager notifications={experience.notifications} />}
      {activeTab === "media" && <PosterUpload />}
    </div>
  );
}
