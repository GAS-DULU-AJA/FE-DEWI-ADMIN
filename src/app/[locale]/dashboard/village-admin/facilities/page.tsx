"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FacilityCard, FacilityForm, FACILITIES, VillagePageHeader } from "@/features/village";

export default function FacilitiesPage() {
  const t = useTranslations("village");
  const [category, setCategory] = useState("all");

  const list = useMemo(() => {
    if (category === "all") return FACILITIES;
    return FACILITIES.filter((item) => item.category === category);
  }, [category]);

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("facilities.title")}
        description={t("facilities.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.facilities") },
        ]}
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
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/village-admin/facilities/${facility.id}`}>{t("actions.viewDetail")}</Link>
            </Button>
          </div>
        ))}
      </div>

      <FacilityForm />
    </div>
  );
}
