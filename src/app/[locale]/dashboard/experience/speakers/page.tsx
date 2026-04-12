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
        <h1 className="text-2xl font-bold text-stone-900">{t("speakers.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("speakers.subtitle")}</p>
      </div>

      <SpeakersCrudManager initialSpeakers={speakers} />
    </div>
  );
}
