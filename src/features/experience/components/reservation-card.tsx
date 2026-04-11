import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExperienceReservation } from "@/features/experience";
import { useTranslations } from "next-intl";

export function ReservationCard({ reservation }: { reservation: ExperienceReservation }) {
  const t = useTranslations("experience");
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{reservation.customerName}</CardTitle>
          <Badge variant={reservation.paymentStatus === "success" ? "default" : "secondary"}>
            {t(`reservationStatus.${reservation.paymentStatus}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-stone-600">
        <p>{reservation.experienceName}</p>
        <p>{reservation.ticketTypeName} · {t("components.qty")} {reservation.quantity}</p>
        <p>{t("components.booking")}: {t(`bookingStatus.${reservation.bookingStatus}`)}</p>
      </CardContent>
    </Card>
  );
}
