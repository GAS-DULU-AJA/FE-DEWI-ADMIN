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
        <h1 className="text-2xl font-bold text-stone-900">{t("attendees.pageTitle")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("attendees.pageSubtitle")}</p>
      </div>

      <QRCheckInScanner reservations={reservations} />
      <AttendeeTable reservations={reservations} />
    </div>
  );
}
