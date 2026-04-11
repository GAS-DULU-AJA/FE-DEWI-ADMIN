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
        <h1 className="text-2xl font-bold text-stone-900">{t("add.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("add.subtitle")}</p>
      </div>
      <ExperienceWizard />
    </div>
  );
}
