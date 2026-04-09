"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { LOCALE_LABELS } from "@/lib/constants";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          aria-label={t("appName")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">
            {LOCALE_LABELS[locale]?.split(" ")[0]}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="z-50 min-w-40 rounded-xl border border-stone-200 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          {Object.entries(LOCALE_LABELS).map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleChange(code)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                locale === code
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-stone-700 hover:bg-stone-50"
              )}
            >
              {label}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
