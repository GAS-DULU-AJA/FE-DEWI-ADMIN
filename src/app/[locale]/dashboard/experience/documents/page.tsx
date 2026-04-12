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
  const allDocuments = experiences.flatMap((e) => e.documents);
  const allNotifications = experiences.flatMap((e) => e.notifications);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("documents.pageTitle")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("documents.pageSubtitle")}</p>
      </div>

      <DocumentManager documents={allDocuments} />
      <NotificationManager notifications={allNotifications} />
    </div>
  );
}
