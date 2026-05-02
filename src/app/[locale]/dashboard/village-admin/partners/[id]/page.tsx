"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PARTNER_APPLICATIONS } from "@/features/village/mock-data";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { PartnerDetail } from "@/features/village/components/partner-detail";

export default function PartnerDetailPage() {
  const t = useTranslations("village");
  const { id } = useParams<{ id: string }>();
  const partner = PARTNER_APPLICATIONS.find((p) => p.id === id);

  if (!partner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={partner.organizationName}
        description={partner.ownerName}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.partners"), href: "/dashboard/village-admin/partners" },
          { label: partner.organizationName },
        ]}
        badge={
          <Badge variant={partner.status === "approved" ? "default" : "secondary"}>
            {t(`approval.statuses.${partner.status}`)}
          </Badge>
        }
      />

      <PartnerDetail application={partner} />

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/village-admin/partners">{t("partners.backToList")}</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/village-admin/approval">{t("partners.viewApproval")}</Link>
        </Button>
      </div>
    </div>
  );
}
