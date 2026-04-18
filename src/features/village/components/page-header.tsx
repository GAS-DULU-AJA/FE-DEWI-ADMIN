"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type VillagePageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
  badge?: ReactNode;
};

export function VillagePageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  backLabel,
  action,
  badge,
}: VillagePageHeaderProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-stone-900 hover:underline underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-stone-900" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-stone-400" />}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
            {badge}
          </div>
          {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {backHref ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          ) : null}
          {action}
        </div>
      </div>
    </div>
  );
}
