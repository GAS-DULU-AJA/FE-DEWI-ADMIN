"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";
import { formatCurrency } from "@/lib/utils";

export default function FacilityDetailPage() {
  const t = useTranslations("village");
  const { id } = useParams<{ id: string }>();
  const facilities = useFacilityManagementStore((state) => state.facilities);
  const facility = facilities.find((item) => item.id === id);

  if (!facility) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={facility.name}
        description={facility.address}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities"), href: "/dashboard/village-admin/facilities" },
          { label: facility.name },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("facilities.facilityInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-stone-700">
          <p><span className="font-medium">{t("facilities.category")}:</span> {t(`facilities.categories.${facility.category}`)}</p>
          <p>{facility.description}</p>
          <p>
            <span className="font-medium">{t("facilities.isMonetizable")}:</span>{" "}
            {facility.isMonetizable ? t("facilities.categories.monetizable") : t("facilities.notMonetizable")}
          </p>
          {facility.isMonetizable && facility.rentalPrice != null ? (
            <p><span className="font-medium">{t("facilities.rentalPrice")}:</span> {formatCurrency(facility.rentalPrice)}</p>
          ) : null}
          {facility.capacity != null ? (
            <p><span className="font-medium">{t("facilities.capacity")}:</span> {facility.capacity}</p>
          ) : null}
          {facility.utilizationRate != null ? (
            <p><span className="font-medium">{t("facilities.utilizationLabel")}:</span> {facility.utilizationRate}%</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
