
let payosInstance: any = null;

function getPayOS(): any {
  if (payosInstance) return payosInstance;

  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    throw new Error("Cổng thanh toán PayOS chưa được cấu hình. Vui lòng kiểm tra file .env.local");
  }

  // Khắc phục lỗi "is not a constructor" cho PayOS v2.x (Sử dụng Named Export)
  try {
    const { PayOS } = require("@payos/node");
    payosInstance = new PayOS(clientId, apiKey, checksumKey);
  } catch (error) {
    console.error("Lỗi khởi tạo PayOS:", error);
    throw new Error("Không thể khởi động cổng thanh toán PayOS.");
  }
  
  return payosInstance;
}

export interface PayOSOrderData {
  orderCode: number; // Mã đơn hàng (unique, dạng số)
  amount: number; // Số tiền (VNĐ)
  description: string; // Mô tả đơn hàng (tối đa 25 ký tự)
  cancelUrl: string; // URL khi hủy thanh toán
  returnUrl: string; // URL khi thanh toán thành công
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
}

/**
 * Tạo payment link qua PayOS
 * Trả về checkout URL để redirect người dùng
 */
export async function createPayOSPaymentLink(
  orderData: PayOSOrderData
): Promise<string> {
  try {
    const payos = getPayOS();
    // Chuẩn v2: Sử dụng payos.paymentRequests.create
    const paymentLinkRes = await payos.paymentRequests.create(orderData);
    return paymentLinkRes.checkoutUrl;
  } catch (error: any) {
    console.error("[PAYOS ERROR]", error);
    throw new Error(error.message || "Không thể tạo link thanh toán PayOS.");
  }
}

/**
 * Xác thực dữ liệu webhook từ PayOS
 */
export function verifyPayOSWebhookData(body: any) {
  const payos = getPayOS();
  // Chuẩn v2: Sử dụng payos.webhooks.verify
  return payos.webhooks.verify(body);
}
