import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getExperienceById,
  TicketManager,
  ItineraryBuilder,
  PosterUpload,
} from "@/features/experience";

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const experience = getExperienceById(id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{experience.name}</h1>
        <p className="mt-1 text-sm text-stone-500">{experience.shortDescription}</p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700">
        <p>{t("detail.location")}: {experience.locationName}</p>
        <p>{t("detail.schedule")}: {new Date(experience.scheduleStart).toLocaleString()} - {new Date(experience.scheduleEnd).toLocaleString()}</p>
        <p>{t("detail.status")}: {t(`status.${experience.status}`)}</p>
      </div>

      <TicketManager tickets={experience.ticketTypes} />
      <ItineraryBuilder items={experience.itinerary} />
      <PosterUpload />
    </div>
  );
}
