import { SpeakersCrudManager } from "@/features/experience/components/speakers-crud-manager";
import { getSpeakers } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceSpeakersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const speakers = getSpeakers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("speakers.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("speakers.subtitle")}</p>
      </div>

      <SpeakersCrudManager initialSpeakers={speakers} />
    </div>
  );
}
