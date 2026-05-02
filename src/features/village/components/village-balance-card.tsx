"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Banknote, TrendingUp, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormModal } from "@/components/ui/form-modal";
import { formatCurrency } from "@/lib/utils";
import { BALANCE_TRANSACTIONS, VILLAGE_BALANCE, VILLAGE_PROFILE } from "../mock-data";
import type { BalanceTransactionType } from "../types";

const TX_TYPE_META: Record<BalanceTransactionType, { label: string; color: string }> = {
  facility_rental: { label: "Sewa Fasilitas", color: "text-emerald-600" },
  revenue_share: { label: "Bagi Hasil Event", color: "text-blue-600" },
  withdrawal: { label: "Penarikan", color: "text-red-500" },
  refund: { label: "Refund", color: "text-amber-600" },
};

export function VillageBalanceCard() {
  const balance = VILLAGE_BALANCE;
  const transactions = BALANCE_TRANSACTIONS;
  const profile = VILLAGE_PROFILE;
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");

  return (
    <>
      {/* Balance Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="flex items-center gap-1.5 text-xs text-on-surface/60">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              Saldo Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xl font-bold text-primary">{formatCurrency(balance.currentBalance)}</p>
            <p className="mt-0.5 text-xs text-on-surface/40">Update: {new Date(balance.lastUpdatedAt).toLocaleDateString("id-ID")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="flex items-center gap-1.5 text-xs text-on-surface/60">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              Total Diterima
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(balance.totalEarnedAllTime)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="flex items-center gap-1.5 text-xs text-on-surface/60">
              <ArrowUpRight className="h-3.5 w-3.5 text-amber-500" />
              Menunggu Masuk
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xl font-bold text-amber-600">{formatCurrency(balance.pendingIncoming)}</p>
            <p className="mt-0.5 text-xs text-on-surface/40">Invoice belum dibayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="flex items-center gap-1.5 text-xs text-on-surface/60">
              <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
              Total Dicairkan
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xl font-bold text-on-surface">{formatCurrency(balance.totalWithdrawn)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action + Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Riwayat Transaksi Saldo Desa</CardTitle>
          </div>
          <Button size="sm" onClick={() => setWithdrawOpen(true)} disabled={balance.currentBalance <= 0}>
            Tarik Saldo
          </Button>
        </CardHeader>
        <CardContent className="space-y-1">
          {transactions.length === 0 ? (
            <p className="py-6 text-center text-sm text-on-surface/50">Belum ada transaksi.</p>
          ) : (
            <div className="divide-y divide-surface-container">
              {transactions.map((tx) => {
                const meta = TX_TYPE_META[tx.type];
                const isCredit = tx.amount > 0;
                return (
                  <div key={tx.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-on-surface">{tx.description}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className={`text-xs font-medium ${meta.color}`}>{meta.label}</span>
                        <span className="text-xs text-on-surface/40">{new Date(tx.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`font-semibold ${isCredit ? "text-emerald-600" : "text-red-500"}`}>
                        {isCredit ? "+" : ""}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-on-surface/40">Saldo: {formatCurrency(tx.balanceAfter)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Modal */}
      <FormModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        title="Tarik Saldo Desa"
        description={`Saldo tersedia: ${formatCurrency(balance.currentBalance)}`}
        size="sm"
        submitLabel="Ajukan Penarikan"
        onSubmit={() => {
          setWithdrawOpen(false);
          setAmount("");
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-amount">Jumlah Penarikan (IDR)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              min={100000}
              max={balance.currentBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah..."
            />
          </div>
          <div className="rounded-lg border border-surface-container-high bg-surface-container-low px-3 py-2 text-sm space-y-1">
            <p className="font-medium text-on-surface/80">Tujuan Transfer</p>
            <p className="text-on-surface/70">{profile.bankName} — {profile.bankAccountName}</p>
            <p className="font-mono text-on-surface/60">{profile.bankAccountNumber}</p>
          </div>
          <p className="text-xs text-on-surface/40">Estimasi dana masuk 1–2 hari kerja setelah disetujui.</p>
        </div>
      </FormModal>
    </>
  );
}
