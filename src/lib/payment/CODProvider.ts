// src/lib/payment/CODProvider.ts
import { PaymentProvider, PaymentRequest } from "./types";

export class CODProvider implements PaymentProvider {
  async createPaymentLink(data: PaymentRequest): Promise<string | null> {
    // Thanh toán khi nhận hàng không cần tạo link thanh toán online
    return null;
  }
}
