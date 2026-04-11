import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Facility } from "../types";

export function FacilityCard({ facility }: { facility: Facility }) {
  const t = useTranslations("village");
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{facility.name}</CardTitle>
          <Badge variant={facility.isMonetizable ? "default" : "secondary"}>
            {t(`facilities.categories.${facility.category}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-stone-600">
        <p>{facility.description}</p>
        <p>{facility.address}</p>
        <p>
          {facility.isMonetizable
            ? `${t("facilities.rental")}: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(facility.rentalPrice ?? 0)}`
            : t("facilities.notMonetizable")}
        </p>
      </CardContent>
    </Card>
  );
}
