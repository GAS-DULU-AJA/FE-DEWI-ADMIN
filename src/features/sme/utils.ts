import {
  SME_ORDERS,
  SME_PRODUCTS,
  SME_PROMOTIONS,
  SME_REVIEWS,
  SME_STOCK_ADJUSTMENTS,
} from "./mock-data";

export function getSmeProducts() {
  return SME_PRODUCTS;
}

export function getSmeOrders() {
  return SME_ORDERS;
}

export function getSmeReviews() {
  return SME_REVIEWS;
}

export function getSmePromotions() {
  return SME_PROMOTIONS;
}

export function getSmeStockAdjustments() {
  return SME_STOCK_ADJUSTMENTS;
}

export function getSmeDashboardMetrics() {
  const products = getSmeProducts();
  const orders = getSmeOrders();
  const reviews = getSmeReviews();

  const monthlyRevenue = orders
    .filter((order) => order.paymentStatus === "success")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return {
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.isAvailable).length,
    ordersToday: orders.length,
    monthlyRevenue,
    lowStockAlerts: products.filter((product) => product.stock <= 5).length,
    averageRating,
  };
}
