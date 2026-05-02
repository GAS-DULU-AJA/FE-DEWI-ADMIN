import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      <Link
        href="/dashboard"
        className="flex items-center text-on-surface/40 hover:text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3.5 w-3.5 text-on-surface/30 shrink-0" />
          {item.href && idx < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-on-surface/60 hover:text-primary transition-colors truncate max-w-[200px]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-on-surface truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export { Breadcrumb };
export type { BreadcrumbItem, BreadcrumbProps };
