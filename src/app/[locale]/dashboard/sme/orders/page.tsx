"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type ActionItem, type ColumnDef } from "@/components/ui/data-table";
import { PickupTimeline } from "@/features/sme/components/pickup-timeline";
import { SmeOrderCard } from "@/features/sme/components/order-card";
import { SmeOrderDetail } from "@/features/sme/components/order-detail";
import type { SmeOrder, SmeOrderStatus } from "@/features/sme/types";
import { getSmeOrders } from "@/features/sme/utils";
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
  const ts = useTranslations("sme");
  const tc = useTranslations("common");
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

  const columns = useMemo<ColumnDef<SmeOrder>[]>(
    () => [
      {
        id: "customer",
        header: t("customer"),
        accessorKey: "customerName",
        sortable: true,
      },
      {
        id: "status",
        header: tc("status"),
        accessorKey: "status",
        sortable: true,
        filterable: true,
        filterOptions: [
          { label: ts("orderStatus.pending_payment"), value: "pending_payment" },
          { label: ts("orderStatus.paid"), value: "paid" },
          { label: ts("orderStatus.preparing"), value: "preparing" },
          { label: ts("orderStatus.ready_for_pickup"), value: "ready_for_pickup" },
          { label: ts("orderStatus.picked_up"), value: "picked_up" },
          { label: ts("orderStatus.cancelled"), value: "cancelled" },
          { label: ts("orderStatus.refunded"), value: "refunded" },
        ],
        accessorFn: (row) => ts(`orderStatus.${row.status}`),
      },
      {
        id: "total",
        header: t("total"),
        accessorFn: (row) => row.totalPrice.toLocaleString("id-ID"),
        sortable: true,
      },
      {
        id: "updatedAt",
        header: tc("date"),
        accessorKey: "updatedAt",
        sortable: true,
        hideOnMobile: true,
      },
    ],
    [t, tc, ts],
  );

  const actions = (row: SmeOrder): ActionItem[] => [
    {
      label: tc("view"),
      onClick: () => setSelectedOrderId(row.id),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-on-surface/60">
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
          <CardContent className="text-2xl font-semibold text-primary">
            {orders.filter((order) => order.status === "ready_for_pickup").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("summary.completedToday")}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-on-surface">
            {orders.filter((order) => order.status === "picked_up").length}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <DataTable
          data={orders}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchableFields={["customerName", "customerEmail", "customerPhone", "status"]}
          searchPlaceholder={`${tc("search")}...`}
          pageSize={10}
          onRowClick={(row) => setSelectedOrderId(row.id)}
          actions={actions}
          mobileCardRenderer={(row) => (
            <SmeOrderCard
              order={row}
              selected={row.id === highlightedOrder?.id}
              onSelect={() => setSelectedOrderId(row.id)}
            />
          )}
        />

        <div className="space-y-4">
          {highlightedOrder ? <SmeOrderDetail order={highlightedOrder} /> : null}
          {highlightedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("actions.title")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {ACTIONS_BY_STATUS[highlightedOrder.status].length === 0 ? (
                  <p className="text-sm text-on-surface/60">{t("actions.noActions")}</p>
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
