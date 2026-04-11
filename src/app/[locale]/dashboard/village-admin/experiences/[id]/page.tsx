"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPERIENCES, VillagePageHeader } from "@/features/village";
import { formatCurrency } from "@/lib/utils";

export default function ExperienceDetailPage() {
  const t = useTranslations("village");
  const { id } = useParams<{ id: string }>();
  const item = EXPERIENCES.find((experience) => experience.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={item.name}
        description={item.location}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences"), href: "/dashboard/village-admin/experiences" },
          { label: item.name },
        ]}
        badge={
          <Badge variant={item.status === "published" || item.status === "ongoing" ? "default" : "secondary"}>
            {t(`experiences.statuses.${item.status}`)}
          </Badge>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("experiences.detailTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-stone-700">
          <p>{item.description}</p>
          <p><span className="font-medium">{t("experiences.category")}:</span> {t(`experiences.categories.${item.category}`)}</p>
          <p><span className="font-medium">{t("experiences.scheduleLabel")}:</span> {new Date(item.startsAt).toLocaleString()} – {new Date(item.endsAt).toLocaleString()}</p>
          <p><span className="font-medium">{t("experiences.capacity")}:</span> {t("experiences.bookedOf", { booked: item.booked, capacity: item.capacity })}</p>
          <p><span className="font-medium">{t("experiences.pricePerPerson")}:</span> {formatCurrency(item.pricePerPerson)}</p>
          <p><span className="font-medium">{t("experiences.contactPerson")}:</span> {item.contactPerson}</p>
          <p><span className="font-medium">{t("experiences.cancellationPolicy")}:</span> {item.cancellationPolicy}</p>
        </CardContent>
      </Card>
    </div>
  );
}
