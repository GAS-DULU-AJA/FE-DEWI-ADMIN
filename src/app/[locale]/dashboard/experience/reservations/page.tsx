import {
  CheckInManager,
  ReservationCard,
  ReservationActionPanel,
  getExperienceReservations,
} from "@/features/experience";
import { getTranslations } from "next-intl/server";

export default async function ExperienceReservationsPage({
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
        <h1 className="text-2xl font-bold text-stone-900">{t("reservations.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("reservations.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>

      <ReservationActionPanel reservations={reservations} />
      <CheckInManager reservations={reservations} />
    </div>
  );
}
