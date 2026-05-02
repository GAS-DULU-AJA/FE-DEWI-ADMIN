"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { COMMISSION_CONFIG } from "../mock-data";

export function CommissionConfigCard() {
  const [config, setConfig] = useState(COMMISSION_CONFIG);
  const [saved, setSaved] = useState(false);

  const totalSplit = config.splitOrganizer + config.splitVillage + config.splitPlatform;
  const isValid = totalSplit === 100 && config.commissionPercent >= 5 && config.commissionPercent <= 15;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Example calculation
  const exampleAmount = 500_000;
  const platformFee = Math.round(exampleAmount * (config.commissionPercent / 100));
  const convenience = config.convenienceFeeFlat;
  const totalFee = platformFee + convenience;
  const net = exampleAmount - totalFee;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Settings2 className="h-4 w-4 text-primary" />
        <CardTitle className="text-base">Konfigurasi Komisi & Fee Transaksi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Commission & Convenience Fee */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="commission-pct">Komisi Platform (%)</Label>
            <p className="text-xs text-on-surface/50">Potongan dari setiap transaksi booking (5–15%)</p>
            <Input
              id="commission-pct"
              type="number"
              min={5}
              max={15}
              value={config.commissionPercent}
              onChange={(e) => setConfig((c) => ({ ...c, commissionPercent: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="convenience-fee">Convenience Fee (IDR/transaksi)</Label>
            <p className="text-xs text-on-surface/50">Biaya admin per transaksi wisatawan</p>
            <Input
              id="convenience-fee"
              type="number"
              min={0}
              value={config.convenienceFeeFlat}
              onChange={(e) => setConfig((c) => ({ ...c, convenienceFeeFlat: Number(e.target.value) || 0 }))}
            />
          </div>
        </div>

        {/* Split Distribution */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-on-surface/80">Distribusi Split Payment (%)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="split-organizer">Organizer / Vendor</Label>
              <Input
                id="split-organizer"
                type="number"
                min={0}
                max={100}
                value={config.splitOrganizer}
                onChange={(e) => setConfig((c) => ({ ...c, splitOrganizer: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="split-village">Desa</Label>
              <Input
                id="split-village"
                type="number"
                min={0}
                max={100}
                value={config.splitVillage}
                onChange={(e) => setConfig((c) => ({ ...c, splitVillage: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="split-platform">Platform (fixed)</Label>
              <Input
                id="split-platform"
                type="number"
                min={0}
                max={100}
                value={config.splitPlatform}
                onChange={(e) => setConfig((c) => ({ ...c, splitPlatform: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <p className={`text-xs font-medium ${totalSplit === 100 ? "text-emerald-600" : "text-red-500"}`}>
            Total: {totalSplit}% {totalSplit !== 100 ? "— harus tepat 100%" : "✓"}
          </p>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl border border-surface-container-high bg-surface-container-low p-4 space-y-2 text-sm">
          <p className="font-semibold text-on-surface/80">Contoh Kalkulasi (Transaksi {formatCurrency(exampleAmount)})</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface/60">Komisi Platform ({config.commissionPercent}%)</span>
              <span className="text-red-500">−{formatCurrency(platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface/60">Convenience Fee</span>
              <span className="text-red-500">−{formatCurrency(convenience)}</span>
            </div>
            <div className="flex justify-between border-t border-surface-container-high pt-1 font-medium">
              <span className="text-on-surface/80">Net ke Vendor ({config.splitOrganizer}%)</span>
              <span className="text-emerald-600">{formatCurrency(Math.round(net * config.splitOrganizer / 100))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface/60">→ Ke Desa ({config.splitVillage}%)</span>
              <span className="text-blue-600">{formatCurrency(Math.round(net * config.splitVillage / 100))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface/60">→ Ke Platform ({config.splitPlatform}%)</span>
              <span className="text-on-surface/60">{formatCurrency(Math.round(net * config.splitPlatform / 100))}</span>
            </div>
          </div>
        </div>

        <Button size="sm" disabled={!isValid} onClick={handleSave}>
          {saved ? "✓ Tersimpan" : "Simpan Konfigurasi"}
        </Button>
      </CardContent>
    </Card>
  );
}
