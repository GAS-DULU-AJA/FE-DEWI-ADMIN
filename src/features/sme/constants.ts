import type { SmeOrderStatus, SmePromotion } from "./types";

export const SME_ORDER_STATUS_META: Record<
  SmeOrderStatus,
  { className: string }
> = {
  pending_payment: {
    className: "bg-amber-100 text-amber-700",
  },
  paid: { className: "bg-blue-100 text-blue-700" },
  preparing: {
    className: "bg-indigo-100 text-indigo-700",
  },
  ready_for_pickup: {
    className: "bg-emerald-100 text-emerald-700",
  },
  picked_up: { className: "bg-stone-100 text-stone-700" },
  cancelled: { className: "bg-red-100 text-red-700" },
  refunded: { className: "bg-violet-100 text-violet-700" },
};

export const SME_PROMOTION_TYPES: Array<SmePromotion["type"]> = [
  "product_discount",
  "category_sale",
  "bundle_deal",
  "buy_x_get_y",
  "flash_sale",
  "promo_code",
  "first_purchase",
];

export const SME_BUSINESS_TYPES = [
  "food",
  "craft",
  "clothing",
  "souvenir",
  "service",
  "other",
] as const;
