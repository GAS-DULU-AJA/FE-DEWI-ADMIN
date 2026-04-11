"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BankAccount } from "@/types";

function maskAccountNumber(value: string) {
  if (value.length <= 4) return value;
  return `**** **** ${value.slice(-4)}`;
}

export function BankAccountForm({ account }: { account: BankAccount }) {
  const [form, setForm] = useState(account);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Account Holder Name</Label>
          <Input value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Bank Name</Label>
          <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Masked Preview</Label>
          <Input disabled value={maskAccountNumber(form.accountNumber)} />
        </div>
        <div className="space-y-2">
          <Label>Branch</Label>
          <Input value={form.branch ?? ""} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>SWIFT Code</Label>
          <Input value={form.swiftCode ?? ""} onChange={(e) => setForm({ ...form, swiftCode: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
          <span>Verification Status</span>
          <span className={form.isVerified ? "text-emerald-700" : "text-amber-700"}>{form.isVerified ? "Verified" : "Pending verification"}</span>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button>Save Bank Account</Button>
        </div>
      </CardContent>
    </Card>
  );
}
