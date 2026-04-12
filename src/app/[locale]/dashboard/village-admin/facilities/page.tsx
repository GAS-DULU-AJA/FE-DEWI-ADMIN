"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { FacilityCard } from "@/features/village/components/facility-card";
import { FacilityForm } from "@/features/village/components/facility-form";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";

export default function FacilitiesPage() {
  const t = useTranslations("village");
  const [category, setCategory] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { facilities, upsertFacility, deleteFacility } = useFacilityManagementStore();

  const list = useMemo(() => {
    if (category === "all") return facilities;
    return facilities.filter((item) => item.category === category);
  }, [category, facilities]);

  const editingFacility = editingId ? facilities.find((item) => item.id === editingId) ?? null : null;
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
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/village-admin/facilities/reservations">
              {t("facilities.manageReservations")}
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {["all", "public", "security", "transportation", "monetizable"].map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-3 py-1 text-xs ${category === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((facility) => (
          <div key={facility.id} className="space-y-2">
            <FacilityCard facility={facility} />
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/village-admin/facilities/${facility.id}`}>{t("actions.viewDetail")}</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditingId(facility.id)}>
                {t("common.edit")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeletingId(facility.id)}>
                {t("common.delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <FacilityForm
        initialFacility={editingFacility}
        onCancel={() => setEditingId(null)}
        onSubmit={(payload) => {
          upsertFacility(payload, editingFacility?.id);
          setEditingId(null);
        }}
      />

      <ConfirmationDialog
        open={!!deletingFacility}
        title={t("facilities.deleteConfirmTitle")}
        description={t("facilities.deleteConfirmDescription", {
          name: deletingFacility?.name || "",
        })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
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
