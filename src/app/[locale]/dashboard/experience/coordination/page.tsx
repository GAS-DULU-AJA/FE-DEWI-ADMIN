import { CoordinationPanel } from "@/features/experience/components/coordination-panel";
import { FacilityBrowser } from "@/features/experience/components/facility-browser";
import { FacilityAvailabilityCalendar } from "@/features/experience/components/facility-availability-calendar";
import { PaymentMilestoneTracker } from "@/features/experience/components/payment-milestone-tracker";
import { RevenueShareDisplay } from "@/features/experience/components/revenue-share-display";
import { ProposalStatusTracker } from "@/features/shared/proposals/components/proposal-status-tracker";
import { getProposalsForRole } from "@/features/shared/proposals/utils";
import { VILLAGE_FACILITIES } from "@/features/experience/mock-data";
import { getExperienceCoordinations } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceCoordinationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isId = locale === "id";
  const t = await getTranslations({ locale, namespace: "experience" });
  const coordinations = getExperienceCoordinations();
  const active = coordinations[0];
  const proposalTrackers = getProposalsForRole("EVENT_ORGANIZER");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("coordination.title")}</h1>
        <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{t("coordination.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {proposalTrackers.map((proposal) => (
          <ProposalStatusTracker
            key={proposal.id}
            status={proposal.status}
            timeline={proposal.timeline}
            rejectionReason={proposal.rejectionReason}
            isId={isId}
          />
        ))}
      </div>

      <CoordinationPanel coordinations={coordinations} />
      <FacilityBrowser facilities={[...VILLAGE_FACILITIES]} />
      <FacilityAvailabilityCalendar
        facilities={VILLAGE_FACILITIES.map((item) => ({ id: item.id, name: item.name }))}
        reservations={coordinations.flatMap((item) =>
          item.facilityRequests.map((request) => ({
            facilityId: request.facilityId,
            date: request.date,
            hours: request.hours,
          }))
        )}
      />
      {active ? <RevenueShareDisplay split={active.revenueSplit} /> : null}
      {active ? <PaymentMilestoneTracker milestones={active.paymentSchedule} /> : null}
    </div>
  );
}
