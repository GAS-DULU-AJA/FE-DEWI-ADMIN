import { SpeakersCrudManager } from "@/features/experience/components/speakers-crud-manager";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { getSpeakers } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function VillageExperienceSpeakersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "village" });
  const speakers = getSpeakers();

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title="Speakers"
        description="Kelola data pengisi acara untuk dipakai lintas experience pada role pengelola desa."
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: "Speakers" },
        ]}
      />

      <SpeakersCrudManager initialSpeakers={speakers} />
    </div>
  );
}
