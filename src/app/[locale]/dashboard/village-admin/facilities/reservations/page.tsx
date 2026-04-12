"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function VillageFacilityReservationsPage() {
  const t = useTranslations("village");
  const [status, setStatus] = useState("all");
  const [conflictWarning, setConflictWarning] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const { reservations, updateReservationStatus, checkScheduleConflict } =
    useFacilityManagementStore();

  const list = useMemo(() => {
    if (status === "all") return reservations;
    return reservations.filter((item) => item.status === status);
  }, [reservations, status]);

  const handleApprove = (reservation: (typeof reservations)[0]) => {
    const conflict = checkScheduleConflict(
      reservation.facilityId,
      reservation.startDate,
      reservation.endDate,
      reservation.id
    );

    if (conflict) {
      setConflictWarning({
        show: true,
        message: t("facilities.reservations.conflictError", {
          conflictingReservation: conflict.requesterName,
          conflictingDate: `${conflict.startDate} - ${conflict.endDate}`,
        }),
      });
      return;
    }

    updateReservationStatus(reservation.id, "approved");
  };

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("facilities.reservations.title")}
        description={t("facilities.reservations.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities"), href: "/dashboard/village-admin/facilities" },
          { label: t("facilities.reservations.title") },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected", "completed"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`rounded-full px-3 py-1 text-xs ${status === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{reservation.facilityName}</CardTitle>
                  <p className="text-sm text-stone-500">{reservation.requesterName}</p>
                </div>
                <Badge className={STATUS_BADGE_CLASS[reservation.status]}>
                  {t(`facilities.reservations.status.${reservation.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-stone-700">
              <p>
                <span className="font-medium">{t("facilities.reservations.periodLabel")}:</span>{" "}
                {reservation.startDate} - {reservation.endDate}
              </p>
              <p>
                <span className="font-medium">{t("facilities.reservations.participantsLabel")}:</span>{" "}
                {reservation.participants}
              </p>
              <p>
                <span className="font-medium">{t("facilities.reservations.purposeLabel")}:</span>{" "}
                {reservation.purpose}
              </p>
              {reservation.notes ? (
                <p>
                  <span className="font-medium">{t("facilities.reservations.notesLabel")}:</span>{" "}
                  {reservation.notes}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApprove(reservation)}
                  disabled={reservation.status !== "pending"}
                >
                  {t("facilities.reservations.approve")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateReservationStatus(reservation.id, "rejected")}
                  disabled={reservation.status !== "pending"}
                >
                  {t("facilities.reservations.reject")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateReservationStatus(reservation.id, "completed")}
                  disabled={reservation.status !== "approved"}
                >
                  {t("facilities.reservations.complete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmationDialog
        open={conflictWarning.show}
        title={t("facilities.reservations.conflictTitle")}
        description={conflictWarning.message}
        confirmText={t("common.ok")}
        onConfirm={() => setConflictWarning({ show: false, message: "" })}
        onCancel={() => setConflictWarning({ show: false, message: "" })}
      />
    </div>
  );
}
