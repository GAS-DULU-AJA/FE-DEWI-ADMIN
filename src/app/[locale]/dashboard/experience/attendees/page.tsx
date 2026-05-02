import { AttendeeTable } from "@/features/experience/components/attendee-table";
import { QRCheckInScanner } from "@/features/experience/components/qr-check-in-scanner";
import { getExperienceReservations } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceAttendeesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const reservations = getExperienceReservations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("attendees.pageTitle")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("attendees.pageSubtitle")}</p>
      </div>

      <QRCheckInScanner reservations={reservations} />
      <AttendeeTable reservations={reservations} />
    </div>
  );
}
