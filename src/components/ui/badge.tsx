import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-emerald-100 text-emerald-800",
        secondary: "bg-stone-100 text-stone-800",
        amber: "bg-amber-100 text-amber-800",
        blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800",
        violet: "bg-violet-100 text-violet-800",
        outline: "border border-stone-200 text-stone-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
