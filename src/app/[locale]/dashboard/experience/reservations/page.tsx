import { ReservationsWorkspace } from "@/features/experience/components/reservations-workspace";
import { getExperienceReservations } from "@/features/experience/utils";
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

      <ReservationsWorkspace reservations={reservations} />
    </div>
  );
}
