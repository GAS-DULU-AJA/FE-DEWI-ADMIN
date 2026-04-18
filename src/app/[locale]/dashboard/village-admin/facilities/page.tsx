"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { FacilityCard } from "@/features/village/components/facility-card";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";

export default function FacilitiesPage() {
  const t = useTranslations("village");
  const tc = useTranslations("common");
  const [category, setCategory] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { facilities, deleteFacility } = useFacilityManagementStore();

  const list = useMemo(() => {
    if (category === "all") return facilities;
    return facilities.filter((item) => item.category === category);
  }, [category, facilities]);

  const deletingFacility = deletingId ? facilities.find((item) => item.id === deletingId) : null;

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("facilities.title")}
        description={t("facilities.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities") },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/village-admin/facilities/add">
                <Plus className="mr-1 h-4 w-4" />
                {t("facilities.addFacility")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/village-admin/facilities/reservations">
                {t("facilities.manageReservations")}
              </Link>
            </Button>
          </div>
        }
      />

      <SegmentedTabs
        tabs={[
          { id: "all", label: tc("all") },
          { id: "public", label: t("facilities.categories.public") },
          { id: "security", label: t("facilities.categories.security") },
          { id: "transportation", label: t("facilities.categories.transportation") },
          { id: "monetizable", label: t("facilities.categories.monetizable") },
        ]}
        active={category}
        onChange={setCategory}
        sticky
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((facility) => (
          <div key={facility.id} className="space-y-2">
            <FacilityCard facility={facility} />
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/village-admin/facilities/${facility.id}`}>{t("actions.viewDetail")}</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/village-admin/facilities/${facility.id}/edit`}>{tc("edit")}</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeletingId(facility.id)}>
                {tc("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        open={!!deletingFacility}
        title={t("facilities.deleteConfirmTitle")}
        description={t("facilities.deleteConfirmDescription", {
          name: deletingFacility?.name || "",
        })}
        confirmText={tc("delete")}
        cancelText={tc("cancel")}
        variant="destructive"
        onConfirm={() => {
          if (deletingId) {
            deleteFacility(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
