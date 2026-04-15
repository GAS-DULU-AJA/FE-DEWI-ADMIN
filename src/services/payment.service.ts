import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface Payment {
  id: string;
  reservationId?: string;
  orderId?: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isVerified: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  bankAccountId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface IPaymentService {
  getMyPayments(params?: QueryParams): Promise<PaginatedResponse<Payment>>;
  getBankAccounts(): Promise<ApiResponse<BankAccount[]>>;
  addBankAccount(dto: Partial<BankAccount>): Promise<ApiResponse<BankAccount>>;
  removeBankAccount(id: string): Promise<void>;
  requestWithdrawal(dto: { bankAccountId: string; amount: number }): Promise<ApiResponse<WithdrawalRequest>>;
}

export class PaymentService implements IPaymentService {
  async getMyPayments(params?: QueryParams): Promise<PaginatedResponse<Payment>> {
    return apiClient<PaginatedResponse<Payment>>("/payments/my", { params });
  }

  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiClient<ApiResponse<BankAccount[]>>("/admin/bank-accounts");
  }

  async addBankAccount(dto: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    return apiClient<ApiResponse<BankAccount>>("/admin/bank-accounts", {
      method: "POST",
      body: dto,
    });
  }

  async removeBankAccount(id: string): Promise<void> {
    await apiClient(`/admin/bank-accounts/${id}`, { method: "DELETE" });
  }

  async requestWithdrawal(dto: { bankAccountId: string; amount: number }): Promise<ApiResponse<WithdrawalRequest>> {
    return apiClient<ApiResponse<WithdrawalRequest>>("/admin/withdrawals", {
      method: "POST",
      body: dto,
    });
  }
}
