import type { PaymentStatus, Product, Review } from "@/types";

export type SmeBusinessType =
  | "food"
  | "craft"
  | "clothing"
  | "souvenir"
  | "service"
  | "other";

export type SmeOrderStatus =
  | "pending_payment"
  | "paid"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "cancelled"
  | "refunded";

export interface SmeOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  variant?: string;
  subtotal: number;
}

export interface SmeOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: SmeOrderItem[];
  totalPrice: number;
  status: SmeOrderStatus;
  paymentStatus: PaymentStatus;
  estimatedPickupTime?: string;
  actualPickupTime?: string;
  specialInstructions?: string;
  cancellationReason?: string;
  refundAmount?: number;
  smeId: string;
  smeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SmeProfile {
  id: string;
  businessName: string;
  businessType: SmeBusinessType;
  description: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
  operatingHours: Record<string, string>;
  photos: string[];
  logo?: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  taxId?: string;
}

export interface SmePromotion {
  id: string;
  name: string;
  type:
    | "product_discount"
    | "category_sale"
    | "bundle_deal"
    | "buy_x_get_y"
    | "flash_sale"
    | "promo_code"
    | "first_purchase";
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  applicableProductIds: string[] | "all";
  minPurchaseValue?: number;
  maxUsage?: number;
  promoCode?: string;
  status: "active" | "inactive" | "expired";
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out";
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface SmeProduct extends Product {
  subCategory?: string;
  discountPrice?: number;
  minOrderQty?: number;
  maxOrderQty?: number;
  weightGram?: number;
  dimensions?: { length: number; width: number; height: number };
  videoUrl?: string;
  tags?: string[];
  isAvailable: boolean;
  isFeatured?: boolean;
  preparationTimeMinutes?: number;
  shelfLife?: string;
}

export interface SmeReview extends Review {
  response?: string;
  flagged?: boolean;
}
