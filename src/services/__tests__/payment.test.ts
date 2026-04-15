import { describe, it, expect, beforeEach } from "vitest";
import { PaymentServiceMock } from "../mock/payment.mock";

describe("PaymentServiceMock", () => {
  let service: PaymentServiceMock;

  beforeEach(() => {
    service = new PaymentServiceMock();
  });

  describe("getMyPayments", () => {
    it("should return paginated payments", async () => {
      const res = await service.getMyPayments();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.meta).toBeDefined();
    });
  });

  describe("getBankAccounts", () => {
    it("should return list of bank accounts", async () => {
      const res = await service.getBankAccounts();
      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe("addBankAccount", () => {
    it("should add and return bank account", async () => {
      const res = await service.addBankAccount({
        bankName: "BCA",
        accountNumber: "1234567890",
        accountHolder: "Test User",
      });
      expect(res.success).toBe(true);
      expect(res.data.bankName).toBe("BCA");
      expect(res.data.id).toBeDefined();
    });
  });

  describe("removeBankAccount", () => {
    it("should resolve without error", async () => {
      await expect(service.removeBankAccount("bank-1")).resolves.toBeUndefined();
    });
  });

  describe("requestWithdrawal", () => {
    it("should create withdrawal request", async () => {
      const res = await service.requestWithdrawal({
        bankAccountId: "bank-1",
        amount: 500000,
      });
      expect(res.success).toBe(true);
      expect(res.data.amount).toBe(500000);
      expect(res.data.id).toBeDefined();
      expect(res.data.status).toBeDefined();
    });
  });
});
