"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COORDINATION_REQUESTS } from "@/features/village/mock-data";
import { PaymentSchemeForm } from "@/features/village/components/payment-scheme-form";
import { RevenueSharingConfig } from "@/features/village/components/revenue-sharing-config";
import { FacilityInvoiceCard } from "@/features/village/components/facility-invoice-card";
import { EventPublishGate } from "@/features/village/components/event-publish-gate";
import { VillagePageHeader } from "@/features/village/components/page-header";

export default function CoordinationDetailPage() {
  const t = useTranslations("village");
  const { id } = useParams<{ id: string }>();
  const request = COORDINATION_REQUESTS.find((item) => item.id === id);

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={request.eventName}
        description={request.organizerName}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.coordination"), href: "/dashboard/village-admin/coordination" },
          { label: request.eventName },
        ]}
        badge={
          <Badge variant="secondary">{t(`coordination.statuses.${request.status}`)}</Badge>
        }
      />

      {/* Event status & publish gate */}
      <EventPublishGate coordinationRequestId={request.id} eventName={request.eventName} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("coordination.detailTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-on-surface/80">
          <p><span className="font-medium">{t("coordination.requestedDate")}:</span> {request.requestedDate}</p>
          <p><span className="font-medium">{t("coordination.participantsEstimate")}:</span> {request.participantsEstimate}</p>
          <p><span className="font-medium">{t("coordination.requestedFacility")}:</span> {request.requestedFacilityId ?? t("coordination.notSpecified")}</p>
        </CardContent>
      </Card>

      {/* Invoice sewa fasilitas — payment gate sebelum event published */}
      <FacilityInvoiceCard coordinationRequestId={request.id} />

      <RevenueSharingConfig />
      <PaymentSchemeForm />
    </div>
  );
}

