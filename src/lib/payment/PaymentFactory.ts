// src/lib/payment/PaymentFactory.ts
import { PaymentProvider } from "./types";
import { PayOSProvider } from "./PayOSProvider";
import { CODProvider } from "./CODProvider";

export class PaymentFactory {
  static getProvider(method: string): PaymentProvider {
    switch (method.toLowerCase()) {
      case "payos":
        return new PayOSProvider();
      case "cod":
        return new CODProvider();
      default:
        throw new Error(`Phương thức thanh toán '${method}' chưa được hỗ trợ.`);
    }
  }
}
