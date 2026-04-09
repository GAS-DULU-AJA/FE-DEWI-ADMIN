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
  shopping: <ShoppingBag className="h-5 w-5" />,
  bed: <BedDouble className="h-5 w-5" />,
  calendar: <CalendarDays className="h-5 w-5" />,
  revenue: <DollarSign className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  package: <Package className="h-5 w-5" />,
  approval: <CheckSquare className="h-5 w-5" />,
};

const colorVariants = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-700",
    text: "text-amber-700",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-700",
    text: "text-blue-700",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100 text-rose-700",
    text: "text-rose-700",
  },
  violet: {
    bg: "bg-violet-50",
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
    <div className={cn("rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow", c.bg)}>
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", c.icon)}>
          {iconMap[icon] ?? <Package className="h-5 w-5" />}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-emerald-600" : "text-red-500"
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
        <p className="text-2xl font-bold text-stone-900">
          {value}{suffix && <span className="ml-1 text-base font-medium text-stone-500">{suffix}</span>}
        </p>
        <p className="mt-0.5 text-sm text-stone-500">{label}</p>
      </div>
    </div>
  );
}
