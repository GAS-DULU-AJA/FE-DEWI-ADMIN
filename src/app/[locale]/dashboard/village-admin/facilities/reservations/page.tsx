"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { CheckCircle, XCircle, CheckCheck } from "lucide-react";

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function VillageFacilityReservationsPage() {
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const [status, setStatus] = useState("all");
  const [conflictWarning, setConflictWarning] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject" | "complete";
    reservation: (typeof reservations)[0];
  } | null>(null);
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

      <SegmentedTabs
        tabs={[
          { id: "all", label: tc("all") },
          { id: "pending", label: t("facilities.reservations.status.pending") },
          { id: "approved", label: t("facilities.reservations.status.approved") },
          { id: "rejected", label: t("facilities.reservations.status.rejected") },
          { id: "completed", label: t("facilities.reservations.status.completed") },
        ]}
        active={status}
        onChange={setStatus}
        sticky
      />

      <DataTable<(typeof reservations)[0]>
        data={list}
        columns={[
          {
            id: "facility",
            header: t("facilities.reservations.facilityLabel") || "Fasilitas",
            accessorFn: (row) => (
              <div>
                <p className="font-medium text-stone-900">{row.facilityName}</p>
                <p className="text-xs text-stone-500">{row.requesterName}</p>
              </div>
            ),
            sortable: true,
          },
          {
            id: "period",
            header: t("facilities.reservations.periodLabel") || "Periode",
            accessorFn: (row) => `${row.startDate} - ${row.endDate}`,
            sortable: true,
          },
          {
            id: "participants",
            header: t("facilities.reservations.participantsLabel") || "Peserta",
            accessorKey: "participants",
            sortable: true,
            hideOnMobile: true,
          },
          {
            id: "purpose",
            header: t("facilities.reservations.purposeLabel") || "Tujuan",
            accessorKey: "purpose",
            hideOnMobile: true,
          },
          {
            id: "status",
            header: "Status",
            accessorFn: (row) => (
              <Badge className={STATUS_BADGE_CLASS[row.status]}>
                {t(`facilities.reservations.status.${row.status}`)}
              </Badge>
            ),
            sortable: true,
          },
        ] satisfies ColumnDef<(typeof reservations)[0]>[]}
        keyExtractor={(row) => row.id}
        searchPlaceholder={t("facilities.reservations.searchPlaceholder") || "Cari reservasi..."}
        searchableFields={["facilityName", "requesterName", "purpose"] as (keyof (typeof reservations)[0])[]}
        actions={(row) => {
          const items: { label: string; icon?: React.ReactNode; onClick: () => void; variant?: "default" | "destructive" }[] = [];
          if (row.status === "pending") {
            items.push({
              label: t("facilities.reservations.approve"),
              icon: <CheckCircle className="h-4 w-4" />,
              onClick: () => setConfirmAction({ type: "approve", reservation: row }),
            });
            items.push({
              label: t("facilities.reservations.reject"),
              icon: <XCircle className="h-4 w-4" />,
              onClick: () => setConfirmAction({ type: "reject", reservation: row }),
              variant: "destructive",
            });
          }
          if (row.status === "approved") {
            items.push({
              label: t("facilities.reservations.complete"),
              icon: <CheckCheck className="h-4 w-4" />,
              onClick: () => setConfirmAction({ type: "complete", reservation: row }),
            });
          }
          return items;
        }}
        emptyState={{
          title: t("facilities.reservations.noData") || "Tidak ada reservasi",
          description: t("facilities.reservations.noDataDescription") || "Belum ada reservasi fasilitas.",
        }}
      />

      <ConfirmationDialog
        open={conflictWarning.show}
        title={t("facilities.reservations.conflictTitle")}
        description={conflictWarning.message}
        confirmText={tc("ok")}
        onConfirm={() => setConflictWarning({ show: false, message: "" })}
        onCancel={() => setConflictWarning({ show: false, message: "" })}
      />

      <ConfirmationDialog
        open={!!confirmAction}
        title={
          confirmAction?.type === "approve"
            ? t("facilities.reservations.confirmApproveTitle")
            : confirmAction?.type === "reject"
              ? t("facilities.reservations.confirmRejectTitle")
              : t("facilities.reservations.confirmCompleteTitle")
        }
        description={
          confirmAction?.type === "approve"
            ? t("facilities.reservations.confirmApproveMessage", { facility: confirmAction?.reservation.facilityName ?? "" })
            : confirmAction?.type === "reject"
              ? t("facilities.reservations.confirmRejectMessage", { facility: confirmAction?.reservation.facilityName ?? "" })
              : t("facilities.reservations.confirmCompleteMessage", { facility: confirmAction?.reservation.facilityName ?? "" })
        }
        variant={confirmAction?.type === "reject" ? "destructive" : "default"}
        confirmText={
          confirmAction?.type === "approve"
            ? t("facilities.reservations.approve")
            : confirmAction?.type === "reject"
              ? t("facilities.reservations.reject")
              : t("facilities.reservations.complete")
        }
        onConfirm={() => {
          if (!confirmAction) return;
          const { type, reservation } = confirmAction;
          if (type === "approve") {
            handleApprove(reservation);
          } else if (type === "reject") {
            updateReservationStatus(reservation.id, "rejected");
          } else {
            updateReservationStatus(reservation.id, "completed");
          }
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
