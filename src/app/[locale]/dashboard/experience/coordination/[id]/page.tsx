import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PaymentMilestoneTracker } from "@/features/experience/components/payment-milestone-tracker";
import { RevenueShareDisplay } from "@/features/experience/components/revenue-share-display";
import { getCoordinationById } from "@/features/experience/utils";

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
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("coordination.detailTitle", { id: coordination.id })}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("coordination.targetVillage")}: {coordination.targetVillage}</p>
      </div>

      <div className="rounded-lg border-0 bg-surface-container-lowest p-4 text-sm text-on-surface/80">
        <p>{t("detail.status")}: {t(`status.${coordination.status}`)}</p>
        <p>{t("coordination.messages")}: {coordination.messages.length}</p>
        <p>{t("coordination.facilitiesRequested")}: {coordination.facilityRequests.length}</p>
      </div>

      <RevenueShareDisplay split={coordination.revenueSplit} />
      <PaymentMilestoneTracker milestones={coordination.paymentSchedule} />
    </div>
  );
}
