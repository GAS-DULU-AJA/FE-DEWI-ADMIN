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
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("reservations.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("reservations.subtitle")}</p>
      </div>

      <ReservationsWorkspace reservations={reservations} />
    </div>
  );
}
