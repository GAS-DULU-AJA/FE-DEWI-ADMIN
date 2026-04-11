import {
  ACCOMMODATIONS,
  ACCOMMODATION_RESERVATIONS,
  ACCOMMODATION_REVIEWS,
  ACCOMMODATION_ROOMS,
  ACCOMMODATION_BANK_ACCOUNTS,
  ACCOMMODATION_PROMOTIONS,
  ACCOMMODATION_WITHDRAWALS,
  PAYMENTS,
  SUBMISSION_EVENTS,
} from "./mock-data";

export function getAccommodationById(accommodationId: string) {
  return ACCOMMODATIONS.find((item) => item.id === accommodationId);
}

export function getRoomsByAccommodationId(accommodationId: string) {
  return ACCOMMODATION_ROOMS.filter(
    (room) => room.accommodationId === accommodationId
  );
}

export function getAllRooms() {
  return ACCOMMODATION_ROOMS;
}

export function getSubmissionEvents(accommodationId: string) {
  return SUBMISSION_EVENTS[accommodationId] ?? [];
}

export function getPaymentsByAccommodationId(accommodationId: string) {
  const accommodation = getAccommodationById(accommodationId);
  if (!accommodation) return [];

  return PAYMENTS.filter((payment) =>
    payment.items.some((item) => item.partnerId === accommodation.partnerId)
  );
}

export function getAllReservations() {
  return ACCOMMODATION_RESERVATIONS;
}

export function getReservationsByAccommodationId(accommodationId: string) {
  return ACCOMMODATION_RESERVATIONS.filter(
    (reservation) => reservation.accommodationId === accommodationId
  );
}

export function getAllAccommodationReviews() {
  return ACCOMMODATION_REVIEWS;
}

export function getAllAccommodationPromotions() {
  return ACCOMMODATION_PROMOTIONS;
}

export function getPromotionsByAccommodationId(accommodationId: string) {
  return ACCOMMODATION_PROMOTIONS.filter(
    (promotion) =>
      promotion.applicableAccommodationIds === "all" ||
      promotion.applicableAccommodationIds.includes(accommodationId)
  );
}

export function getBankAccountByAccommodationId(accommodationId: string) {
  return ACCOMMODATION_BANK_ACCOUNTS.find((account) => account.accommodationId === accommodationId);
}

export function getWithdrawalsByAccommodationId(accommodationId: string) {
  return ACCOMMODATION_WITHDRAWALS.filter((item) => item.accommodationId === accommodationId);
}

export function getAccommodationReviewsByAccommodationId(accommodationId: string) {
  return ACCOMMODATION_REVIEWS.filter((review) => review.targetId === accommodationId);
}

export function getAccommodationNameById(accommodationId: string) {
  return ACCOMMODATIONS.find((item) => item.id === accommodationId)?.name ?? "-";
}

export function calculateOccupancyRate(accommodationId: string) {
  const rooms = getRoomsByAccommodationId(accommodationId);
  if (rooms.length === 0) return 0;

  const bookedRooms = rooms.filter((room) => room.status === "booked").length;
  return Math.round((bookedRooms / rooms.length) * 100);
}

export function getConsolidatedRevenue() {
  const totalRevenue = PAYMENTS.reduce((total, payment) => total + payment.totalAmount, 0);
  const settledRevenue = PAYMENTS.filter((p) => p.status === "success").reduce(
    (total, payment) => total + payment.totalAmount,
    0
  );

  return {
    totalRevenue,
    settledRevenue,
    totalTransactions: PAYMENTS.length,
  };
}
