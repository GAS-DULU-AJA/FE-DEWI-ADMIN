// Service Factory — toggle between mock and real API via environment variable
// Set NEXT_PUBLIC_USE_MOCK=true in .env for development with mock data

import { AuthService } from "./auth.service";
import { AccommodationService } from "./accommodation.service";
import { RoomService } from "./room.service";
import { ReservationService } from "./reservation.service";
import { SmeService } from "./sme.service";
import { ExperienceService } from "./experience.service";
import { VillageService } from "./village.service";
import { ReviewService } from "./review.service";
import { NotificationService } from "./notification.service";
import { ChatService } from "./chat.service";
import { PaymentService } from "./payment.service";
import { MasterDataService } from "./master-data.service";

import { AuthServiceMock } from "./mock/auth.mock";
import { AccommodationServiceMock } from "./mock/accommodation.mock";
import { RoomServiceMock } from "./mock/room.mock";
import { ReservationServiceMock } from "./mock/reservation.mock";
import { SmeServiceMock } from "./mock/sme.mock";
import { ExperienceServiceMock } from "./mock/experience.mock";
import { VillageServiceMock } from "./mock/village.mock";
import { ReviewServiceMock } from "./mock/review.mock";
import { NotificationServiceMock } from "./mock/notification.mock";
import { ChatServiceMock } from "./mock/chat.mock";
import { PaymentServiceMock } from "./mock/payment.mock";
import { MasterDataServiceMock } from "./mock/master-data.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false"; // default: true (mock)

export const authService = USE_MOCK ? new AuthServiceMock() : new AuthService();
export const accommodationService = USE_MOCK ? new AccommodationServiceMock() : new AccommodationService();
export const roomService = USE_MOCK ? new RoomServiceMock() : new RoomService();
export const reservationService = USE_MOCK ? new ReservationServiceMock() : new ReservationService();
export const smeService = USE_MOCK ? new SmeServiceMock() : new SmeService();
export const experienceService = USE_MOCK ? new ExperienceServiceMock() : new ExperienceService();
export const villageService = USE_MOCK ? new VillageServiceMock() : new VillageService();
export const reviewService = USE_MOCK ? new ReviewServiceMock() : new ReviewService();
export const notificationService = USE_MOCK ? new NotificationServiceMock() : new NotificationService();
export const chatService = USE_MOCK ? new ChatServiceMock() : new ChatService();
export const paymentService = USE_MOCK ? new PaymentServiceMock() : new PaymentService();
export const masterDataService = USE_MOCK ? new MasterDataServiceMock() : new MasterDataService();

// Re-export types
export type { ApiResponse, PaginatedResponse, ApiError, AuthResponse, LoginDto, RegisterDto, QueryParams } from "./types";
export type { IAuthService } from "./auth.service";
export type { IAccommodationService } from "./accommodation.service";
export type { IRoomService } from "./room.service";
export type { IReservationService } from "./reservation.service";
export type { ISmeService } from "./sme.service";
export type { IExperienceService } from "./experience.service";
export type { IVillageService } from "./village.service";
export type { IReviewService } from "./review.service";
export type { INotificationService } from "./notification.service";
export type { IChatService } from "./chat.service";
export type { IPaymentService } from "./payment.service";
export type { IMasterDataService } from "./master-data.service";
