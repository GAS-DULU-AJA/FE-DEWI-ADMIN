"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { PARTNER_APPLICATIONS } from "@/features/village/mock-data";
import { VillagePageHeader } from "@/features/village/components/page-header";

export default function PartnerDetailPage() {
  const t = useTranslations("village");
  const { id } = useParams<{ id: string }>();
  const partner = PARTNER_APPLICATIONS.find((p) => p.id === id);

  if (!partner) {
    notFound();
  }

  const checklistEntries = Object.entries(partner.checklist) as [
    keyof typeof partner.checklist,
    boolean,
  ][];

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.detailTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-stone-700">
          <p><span className="font-medium">{t("partners.role")}:</span> {t(`partners.roles.${partner.role}`)}</p>
          <p><span className="font-medium">{t("partners.submittedAt")}:</span> {partner.submittedAt}</p>
          <p><span className="font-medium">{t("partners.completionScore")}:</span> {partner.completionScore}%</p>
          {partner.latestNote ? (
            <p><span className="font-medium">{t("partners.latestNote")}:</span> {partner.latestNote}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("partners.checklist")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {checklistEntries.map(([key, done]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-stone-300" />
              )}
              <span className={done ? "text-stone-900" : "text-stone-400"}>
                {t(`partners.checklistFields.${key}`)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

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
