"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { FacilityForm } from "@/features/village/components/facility-form";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";
import type { FacilityInput } from "@/features/village/stores/facility-management-store";

export default function EditFacilityPage() {
  const t = useTranslations("village");
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { facilities, upsertFacility } = useFacilityManagementStore();
  const facility = facilities.find((item) => item.id === id);

  if (!facility) {
    notFound();
  }

  const currentFacility = facility;

  function handleSubmit(payload: FacilityInput) {
    upsertFacility(payload, currentFacility.id);
    router.push("/dashboard/village-admin/facilities");
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("facilities.editFacility")}
        description={currentFacility.name}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities"), href: "/dashboard/village-admin/facilities" },
          { label: currentFacility.name, href: `/dashboard/village-admin/facilities/${currentFacility.id}` },
          { label: t("facilities.editFacility") },
        ]}
      />

      <FacilityForm
        initialFacility={currentFacility}
        onCancel={() => router.push("/dashboard/village-admin/facilities")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
