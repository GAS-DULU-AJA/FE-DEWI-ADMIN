import { CoordinationPanel } from "@/features/experience/components/coordination-panel";
import { FacilityBrowser } from "@/features/experience/components/facility-browser";
import { FacilityAvailabilityCalendar } from "@/features/experience/components/facility-availability-calendar";
import { PaymentMilestoneTracker } from "@/features/experience/components/payment-milestone-tracker";
import { RevenueShareDisplay } from "@/features/experience/components/revenue-share-display";
import { VILLAGE_FACILITIES } from "@/features/experience/mock-data";
import { getExperienceCoordinations } from "@/features/experience/utils";
import { getTranslations } from "next-intl/server";

export default async function ExperienceCoordinationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  const coordinations = getExperienceCoordinations();
  const active = coordinations[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("coordination.title")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("coordination.subtitle")}</p>
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
