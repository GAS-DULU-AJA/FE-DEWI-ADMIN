"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExperienceCard, EXPERIENCE_CATEGORIES, getExperiences } from "@/features/experience";
import { useTranslations } from "next-intl";

export default function ExperienceEventsPage() {
  const t = useTranslations("experience");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const experiences = getExperiences();

  const filtered = useMemo(() => {
    return experiences.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, experiences, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("events.title")}</h1>
          <p className="mt-1 text-sm text-stone-500">{t("events.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/experience/events/add">{t("events.add")}</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder={t("events.searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1 text-xs ${category === "all" ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-600"}`}
          >
            {t("events.all")}
          </button>
          {EXPERIENCE_CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1 text-xs ${category === item ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-600"}`}
            >
              {t(`categories.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((item) => (
          <div key={item.id} className="space-y-2">
            <ExperienceCard experience={item} />
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/experience/events/${item.id}`}>{t("events.openDetail")}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
