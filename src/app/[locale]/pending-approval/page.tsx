import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3, LogOut } from "lucide-react";

export default async function PendingApprovalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Card className="border-amber-200 bg-surface-container-lowest/95 shadow-ambient">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Clock3 className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl text-on-surface">{t("pendingApprovalTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="text-sm leading-relaxed text-on-surface/70">{t("pendingApprovalDescription")}</p>
            <div className="rounded-xl border border-surface-container-high bg-surface-container-low p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface/60">{t("pendingApprovalInfoTitle")}</p>
              <p className="mt-2 text-sm text-on-surface/70">{t("pendingApprovalInfoBody")}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/">
                <Button variant="outline">{t("backToHome")}</Button>
              </Link>
              <Link href="/login">
                <Button>
                  <LogOut className="h-4 w-4" />
                  {t("backToLogin")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
