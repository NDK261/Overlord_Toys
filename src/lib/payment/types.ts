// src/lib/payment/types.ts
export interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentRequest {
  orderId: string;
  orderCode: number;
  amount: number;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: PaymentItem[];
  cancelUrl: string;
  returnUrl: string;
}

export interface PaymentProvider {
  createPaymentLink(data: PaymentRequest): Promise<string | null>;
}
