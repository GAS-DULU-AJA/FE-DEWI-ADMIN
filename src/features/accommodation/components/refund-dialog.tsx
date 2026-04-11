"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function RefundDialog({ amount }: { amount: number }) {
  const [refundAmount, setRefundAmount] = useState(amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund Processing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-stone-600">Use this mock dialog to process full or partial refunds based on cancellation policy.</p>
        <Input type="number" min={0} value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value) || 0)} />
        <div className="flex gap-2">
          <Button>Process Refund</Button>
          <Button variant="outline">View Split</Button>
        </div>
      </CardContent>
    </Card>
  );
}
