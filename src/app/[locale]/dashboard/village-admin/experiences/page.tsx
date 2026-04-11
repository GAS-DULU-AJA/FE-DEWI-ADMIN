"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ExperienceCard, EXPERIENCES, VillagePageHeader } from "@/features/village";

export default function ExperiencesPage() {
  const t = useTranslations("village");
  const [status, setStatus] = useState("all");

  const list = useMemo(() => {
    if (status === "all") return EXPERIENCES;
    return EXPERIENCES.filter((item) => item.status === status);
  }, [status]);

  return (
    <div className="space-y-6">
      <VillagePageHeader
        title={t("experiences.title")}
        description={t("experiences.subtitle")}
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: "/dashboard/village-admin" },
          { label: t("breadcrumbs.experiences") },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link href="/dashboard/village-admin/experiences/calendar">{t("nav.calendar")}</Link></Button>
            <Button asChild><Link href="/dashboard/village-admin/experiences/add">{t("actions.addExperience")}</Link></Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {["all", "draft", "published", "ongoing", "completed", "cancelled"].map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-full px-3 py-1 text-xs ${status === item ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((experience) => (
          <div key={experience.id} className="space-y-2">
            <ExperienceCard experience={experience} />
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/village-admin/experiences/${experience.id}`}>{t("actions.viewDetail")}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
