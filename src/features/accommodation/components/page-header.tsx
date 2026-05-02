import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AccommodationPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  action?: ReactNode;
  badge?: ReactNode;
};

export function AccommodationPageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  action,
  badge,
}: AccommodationPageHeaderProps) {
  return (
    <div className="pb-8">
      <nav className="flex flex-wrap items-center gap-1.5 mb-3">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="label-sm text-on-surface/40 hover:text-on-surface/70 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "label-sm text-on-surface/60" : "label-sm text-on-surface/40"}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 text-on-surface/30" />}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{title}</h1>
            {badge}
          </div>
          {description ? <p className="mt-2 font-body text-sm text-on-surface/60 leading-relaxed">{description}</p> : null}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {backHref ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
            </Button>
          ) : null}
          {action}
        </div>
      </div>
    </div>
  );
}