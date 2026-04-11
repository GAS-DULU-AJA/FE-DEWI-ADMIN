import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function StockIndicator({ stock, threshold }: { stock: number; threshold: number }) {
  const t = useTranslations("sme.stock");
  const status = stock <= threshold ? "low" : stock <= threshold * 2 ? "medium" : "healthy";

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        status === "low" && "bg-red-100 text-red-700",
        status === "medium" && "bg-amber-100 text-amber-700",
        status === "healthy" && "bg-emerald-100 text-emerald-700"
      )}
    >
      {t("inStock", { count: stock })}
    </span>
  );
}
