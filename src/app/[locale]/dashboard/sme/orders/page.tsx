"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PickupTimeline,
  SmeOrderCard,
  SmeOrderDetail,
  type SmeOrder,
  type SmeOrderStatus,
  getSmeOrders,
} from "@/features/sme";
import { useTranslations } from "next-intl";

type OrderAction = {
  key: "mark_paid" | "cancel" | "prepare" | "ready" | "picked_up" | "refund";
  nextStatus: SmeOrderStatus;
  tone?: "default" | "destructive" | "outline";
};

const ACTIONS_BY_STATUS: Record<SmeOrderStatus, OrderAction[]> = {
  pending_payment: [
    { key: "mark_paid", nextStatus: "paid", tone: "default" },
    { key: "cancel", nextStatus: "cancelled", tone: "destructive" },
  ],
  paid: [
    { key: "prepare", nextStatus: "preparing", tone: "default" },
    { key: "cancel", nextStatus: "cancelled", tone: "destructive" },
  ],
  preparing: [{ key: "ready", nextStatus: "ready_for_pickup", tone: "default" }],
  ready_for_pickup: [{ key: "picked_up", nextStatus: "picked_up", tone: "default" }],
  picked_up: [],
  cancelled: [{ key: "refund", nextStatus: "refunded", tone: "outline" }],
  refunded: [],
};

export default function SmeOrdersPage() {
  const t = useTranslations("sme.orders");
  const [orders, setOrders] = useState(getSmeOrders());
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id);

  const highlightedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0],
    [orders, selectedOrderId]
  );

  const applyTransition = (order: SmeOrder, nextStatus: SmeOrderStatus): SmeOrder => {
    const now = new Date().toISOString().slice(0, 10);
    return {
      ...order,
      status: nextStatus,
      updatedAt: now,
      paymentStatus:
        nextStatus === "paid" || nextStatus === "preparing" || nextStatus === "ready_for_pickup" || nextStatus === "picked_up"
          ? "success"
          : order.paymentStatus,
      estimatedPickupTime:
        nextStatus === "ready_for_pickup" ? (order.estimatedPickupTime ?? now) : order.estimatedPickupTime,
      actualPickupTime: nextStatus === "picked_up" ? now : order.actualPickupTime,
      cancellationReason: nextStatus === "cancelled" ? (order.cancellationReason ?? t("autoCancelledReason")) : order.cancellationReason,
      refundAmount: nextStatus === "refunded" ? order.totalPrice : order.refundAmount,
    };
  };

  const transitionOrder = (orderId: string, nextStatus: SmeOrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return applyTransition(order, nextStatus);
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.pendingPayment")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-700">
            {orders.filter((order) => order.status === "pending_payment").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.readyForPickup")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-700">
            {orders.filter((order) => order.status === "ready_for_pickup").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.completedToday")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-stone-900">
            {orders.filter((order) => order.status === "picked_up").length}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {orders.map((order) => (
            <SmeOrderCard
              key={order.id}
              order={order}
              selected={order.id === highlightedOrder?.id}
              onSelect={() => setSelectedOrderId(order.id)}
            />
          ))}
        </div>

        <div className="space-y-4">
          {highlightedOrder ? <SmeOrderDetail order={highlightedOrder} /> : null}
          {highlightedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("actions.title")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {ACTIONS_BY_STATUS[highlightedOrder.status].length === 0 ? (
                  <p className="text-sm text-stone-500">{t("actions.noActions")}</p>
                ) : (
                  ACTIONS_BY_STATUS[highlightedOrder.status].map((action) => (
                    <Button
                      key={action.key}
                      variant={action.tone ?? "default"}
                      size="sm"
                      onClick={() => transitionOrder(highlightedOrder.id, action.nextStatus)}
                    >
                      {t(`actions.${action.key}`)}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          ) : null}
          {highlightedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("pickupTimeline")}</CardTitle>
              </CardHeader>
              <CardContent>
                <PickupTimeline status={highlightedOrder.status} />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
