import { ExperienceWizard } from "@/features/experience";
import { getTranslations } from "next-intl/server";

export default async function AddExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("add.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("add.subtitle")}</p>
      </div>
      <ExperienceWizard />
    </div>
  );
}
