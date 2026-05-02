import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getExperienceById, getReservationsByExperienceId } from "@/features/experience/utils";
import { ExperienceDetailTabs } from "@/features/experience/components/experience-detail-tabs";
import { Badge } from "@/components/ui/badge";

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

  const reservations = getReservationsByExperienceId(id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{experience.name}</h1>
          <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{experience.shortDescription}</p>
        </div>
        <Badge variant={experience.status === "ticket_sales_open" || experience.status === "published" ? "default" : "secondary"}>
          {t(`status.${experience.status}`)}
        </Badge>
      </div>
      <ExperienceDetailTabs experience={experience} reservations={reservations} />
    </div>
  );
}
