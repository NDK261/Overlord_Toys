// src/lib/payment/PayOSProvider.ts
import { createPayOSPaymentLink } from "@/lib/payos";
import { PaymentProvider, PaymentRequest } from "./types";

export class PayOSProvider implements PaymentProvider {
  async createPaymentLink(data: PaymentRequest): Promise<string | null> {
    return await createPayOSPaymentLink({
      orderCode: data.orderCode,
      amount: data.amount,
      description: data.description,
      cancelUrl: data.cancelUrl,
      returnUrl: data.returnUrl,
      items: data.items,
      buyerName: data.customerInfo.name,
      buyerEmail: data.customerInfo.email,
      buyerPhone: data.customerInfo.phone,
      buyerAddress: data.customerInfo.address,
    });
  }
}
