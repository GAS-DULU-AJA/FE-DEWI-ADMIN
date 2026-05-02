import { DocumentManager } from "@/features/experience/components/document-manager";
import { NotificationManager } from "@/features/experience/components/notification-manager";
import { getExperiences } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceDocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const experiences = getExperiences();
  const allNotifications = experiences.flatMap((e) => e.notifications);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("documents.pageTitle")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("documents.pageSubtitle")}</p>
      </div>

      {experiences.map((experience) => (
        <div key={experience.id} className="space-y-2">
          <h2 className="text-sm font-semibold text-on-surface/80">{experience.name}</h2>
          <DocumentManager documents={experience.documents} />
        </div>
      ))}

      <NotificationManager notifications={allNotifications} />
    </div>
  );
}
