import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  PaymentMilestoneTracker,
  RevenueShareDisplay,
  getCoordinationById,
} from "@/features/experience";

export default async function CoordinationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const coordination = getCoordinationById(id);

  if (!coordination) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("coordination.detailTitle", { id: coordination.id })}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("coordination.targetVillage")}: {coordination.targetVillage}</p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700">
        <p>{t("detail.status")}: {t(`status.${coordination.status}`)}</p>
        <p>{t("coordination.messages")}: {coordination.messages.length}</p>
        <p>{t("coordination.facilitiesRequested")}: {coordination.facilityRequests.length}</p>
      </div>

      <RevenueShareDisplay split={coordination.revenueSplit} />
      <PaymentMilestoneTracker milestones={coordination.paymentSchedule} />
    </div>
  );
}
