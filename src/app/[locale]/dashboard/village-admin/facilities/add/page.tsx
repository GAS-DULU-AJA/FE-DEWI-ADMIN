"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { VillagePageHeader } from "@/features/village/components/page-header";
import { FacilityForm } from "@/features/village/components/facility-form";
import { useFacilityManagementStore } from "@/features/village/stores/facility-management-store";
import type { FacilityInput } from "@/features/village/stores/facility-management-store";

export default function AddFacilityPage() {
  const t = useTranslations("village");
  const router = useRouter();
  const { upsertFacility } = useFacilityManagementStore();

  function handleSubmit(payload: FacilityInput) {
    upsertFacility(payload);
    router.push("/dashboard/village-admin/facilities");
  }

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("facilities.addFacility")}
        description={t("facilities.addFacilityDesc")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities"), href: "/dashboard/village-admin/facilities" },
          { label: t("facilities.addFacility") },
        ]}
      />

      <FacilityForm
        onCancel={() => router.push("/dashboard/village-admin/facilities")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
