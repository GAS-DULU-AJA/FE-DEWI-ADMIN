"use client";

import { useTranslations } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { QRCheckInScanner } from "@/features/experience/components/qr-check-in-scanner";
import { AttendeeTable } from "@/features/experience/components/attendee-table";
import { getExperienceReservations } from "@/features/experience/utils";

export default function VillageExperienceAttendeesPage() {
  const t = useTranslations("village");
  const reservations = getExperienceReservations();

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.attendeesTitle")}
        description={t("experiences.attendeesSubtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: t("experiences.attendeesTitle") },
        ]}
      />
      <QRCheckInScanner reservations={reservations} />
      <AttendeeTable reservations={reservations} />
    </div>
  );
}
