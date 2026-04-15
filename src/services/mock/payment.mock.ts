import type { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import type { IPaymentService, Payment, BankAccount, WithdrawalRequest } from "../payment.service";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const mockPayments: Payment[] = [
  { id: "pay-1", reservationId: "res-1", status: "success", totalAmount: 750000, paymentMethod: "bank_transfer", createdAt: "2026-04-10T10:00:00Z" },
  { id: "pay-2", reservationId: "res-2", status: "pending", totalAmount: 500000, paymentMethod: "e_wallet", createdAt: "2026-04-12T14:00:00Z" },
  { id: "pay-3", orderId: "ord-1", status: "success", totalAmount: 150000, paymentMethod: "bank_transfer", createdAt: "2026-04-13T09:00:00Z" },
];

const mockBankAccounts: BankAccount[] = [
  { id: "ba-1", userId: "user-1", bankName: "BCA", accountNumber: "1234567890", accountHolder: "Mitra Desa", isVerified: true },
];

export class PaymentServiceMock implements IPaymentService {
  async getMyPayments(params?: QueryParams): Promise<PaginatedResponse<Payment>> {
    await delay(100);
    const page = params?.page ? Number(params.page) : 1;
    const pageSize = params?.limit ? Number(params.limit) : 10;
    return {
      success: true,
      data: mockPayments.slice((page - 1) * pageSize, page * pageSize),
      meta: { total: mockPayments.length, page, pageSize, totalPages: 1 },
    };
  }

  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    await delay(80);
    return { success: true, data: mockBankAccounts, message: "OK" };
  }

  async addBankAccount(dto: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    await delay(200);
    const newAccount = { ...dto, id: "ba-" + Date.now(), isVerified: false } as BankAccount;
    return { success: true, data: newAccount, message: "Created" };
  }

  async removeBankAccount(_id: string): Promise<void> {
    await delay(100);
  }

  async requestWithdrawal(dto: { bankAccountId: string; amount: number }): Promise<ApiResponse<WithdrawalRequest>> {
    await delay(200);
    const req: WithdrawalRequest = {
      id: "wd-" + Date.now(),
      userId: "current-user",
      bankAccountId: dto.bankAccountId,
      amount: dto.amount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: req, message: "Withdrawal requested" };
  }
}
