import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  BedDouble,
  CalendarDays,
  DollarSign,
  Star,
  Package,
  CheckSquare,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  visitors: <Users className="h-5 w-5" />,
  partners: <Users className="h-5 w-5" />,
  shopping: <ShoppingBag className="h-5 w-5" />,
  products: <ShoppingBag className="h-5 w-5" />,
  bed: <BedDouble className="h-5 w-5" />,
  calendar: <CalendarDays className="h-5 w-5" />,
  revenue: <DollarSign className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  package: <Package className="h-5 w-5" />,
  approval: <CheckSquare className="h-5 w-5" />,
};

const colorVariants = {
  emerald: {
    bg: "bg-surface-container-lowest",
    icon: "bg-primary/10 text-primary",
    text: "text-primary",
  },
  amber: {
    bg: "bg-surface-container-lowest",
    icon: "bg-amber-100 text-amber-700",
    text: "text-amber-700",
  },
  blue: {
    bg: "bg-surface-container-lowest",
    icon: "bg-primary/10 text-primary",
    text: "text-primary",
  },
  rose: {
    bg: "bg-surface-container-lowest",
    icon: "bg-rose-100 text-rose-700",
    text: "text-rose-700",
  },
  violet: {
    bg: "bg-surface-container-lowest",
    icon: "bg-violet-100 text-violet-700",
    text: "text-violet-700",
  },
};

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: keyof typeof colorVariants;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  color = "emerald",
  suffix,
}: StatCardProps) {
  const c = colorVariants[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn("group rounded-xl border-0 p-5 shadow-ambient transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5", c.bg)}>
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105", c.icon)}>
          {iconMap[icon] ?? <Package className="h-5 w-5" />}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-primary" : "text-red-500"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-display text-display-md font-bold text-on-surface">
          {value}{suffix && <span className="ml-1 text-base font-medium text-on-surface/50">{suffix}</span>}
        </p>
        <p className="label-sm mt-0.5 text-on-surface/60">{label}</p>
      </div>
    </div>
  );
}
