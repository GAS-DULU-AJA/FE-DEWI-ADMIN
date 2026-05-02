import * as React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container mb-4">
        {icon || <PackageOpen className="h-8 w-8 text-on-surface/40" />}
      </div>
      <h3 className="text-base font-semibold text-on-surface mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface/60 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
