"use client";

import { Check, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PARTNER_SUBSCRIPTION, SUBSCRIPTION_TIERS } from "../mock-data";
import type { SubscriptionTierName } from "../types";

const TIER_COLOR: Record<SubscriptionTierName, string> = {
  free: "text-on-surface/60",
  pro: "text-primary",
  government: "text-amber-600",
};

const TIER_LABEL: Record<SubscriptionTierName, string> = {
  free: "Free",
  pro: "Pro",
  government: "Government / BUMDes",
};

export function SubscriptionTierCard() {
  const current = PARTNER_SUBSCRIPTION;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Zap className="h-4 w-4 text-primary" />
        <CardTitle className="text-base">Paket Langganan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="text-on-surface/70">Paket aktif:</span>
          <Badge variant="default" className="capitalize">{TIER_LABEL[current.currentTier]}</Badge>
          <span className="ml-auto text-xs text-on-surface/40">Aktif sejak {current.activatedAt}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isActive = tier.name === current.currentTier;
            return (
              <div
                key={tier.name}
                className={`rounded-xl border p-4 space-y-3 transition-all ${isActive ? "border-primary/60 bg-primary/5 shadow-sm" : "border-surface-container-high bg-surface-container-lowest"}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${TIER_COLOR[tier.name]}`}>{TIER_LABEL[tier.name]}</p>
                    {isActive && <Badge variant="default" className="text-xs">Aktif</Badge>}
                  </div>
                  <p className="mt-1 text-lg font-bold text-on-surface">
                    {tier.monthlyPrice === 0 ? "Gratis" : `${formatCurrency(tier.monthlyPrice)}/bln`}
                  </p>
                  {tier.commissionDiscount > 0 && (
                    <p className="text-xs text-emerald-600">Hemat komisi {tier.commissionDiscount}%</p>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      {feature.included
                        ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        : <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-on-surface/30" />
                      }
                      <span className={feature.included ? "text-on-surface/80" : "text-on-surface/40 line-through"}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {!isActive && (
                  <Button size="sm" variant={tier.name === "pro" ? "default" : "outline"} className="w-full">
                    {tier.monthlyPrice === 0 ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-on-surface/40">
          Perubahan paket berlaku di awal siklus penagihan berikutnya. Hubungi tim DeWi untuk paket Government.
        </p>
      </CardContent>
    </Card>
  );
}
