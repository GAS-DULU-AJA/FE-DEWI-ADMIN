"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PARTNER_APPLICATIONS, VillagePageHeader } from "@/features/village";

export default function VillageAdminPartnersPage() {
  const t = useTranslations("village");

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("partners.title")}
        description={t("partners.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.partners") },
        ]}
      />

      {PARTNER_APPLICATIONS.length === 0 ? (
        <p className="text-sm text-stone-500">{t("partners.noData")}</p>
      ) : (
        <div className="space-y-3">
          {PARTNER_APPLICATIONS.map((partner) => (
            <Link
              key={partner.id}
              href={`/dashboard/village-admin/partners/${partner.id}`}
              className="block"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
                  <div className="space-y-0.5">
                    <p className="font-medium text-stone-900">{partner.organizationName}</p>
                    <p className="text-xs text-stone-500">{partner.ownerName}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
                    <span>{t("partners.role")}: {t(`partners.roles.${partner.role}`)}</span>
                    <span>{t("partners.submittedAt")}: {partner.submittedAt}</span>
                    <span>{t("partners.completionScore")}: {partner.completionScore}%</span>
                    <Badge variant={partner.status === "approved" ? "default" : "secondary"}>
                      {t(`approval.statuses.${partner.status}`)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
