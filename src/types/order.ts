// src/types/order.ts
// TypeScript types cho đơn hàng - ánh xạ với Supabase schema

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
export type PaymentMethod = "payos" | "vnpay" | "cod";

export interface Order {
  id: string; // uuid
  user_id: string | null; // null nếu guest checkout
  customer_name: string; // tên khách hàng
  customer_phone: string; // số điện thoại
  customer_address: string; // địa chỉ giao hàng
  customer_email?: string; // email (để gửi xác nhận)
  total_price: number; // tổng tiền (VNĐ)
  status: OrderStatus; // trạng thái đơn hàng
  payment_method: PaymentMethod; // phương thức thanh toán
  payment_url?: string; // URL thanh toán PayOS/VNPay
  created_at: string; // ISO timestamp

  // Relations (khi join)
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string; // uuid
  order_id: string; // liên kết order
  product_id: string; // liên kết product
  quantity: number; // số lượng
  price: number; // giá tại thời điểm mua (snapshot)

  // Relations (khi join)
  product?: {
    name: string;
    thumbnail_url: string;
    slug: string;
  };
}

// Dữ liệu gửi lên khi tạo đơn hàng
export interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_email?: string;
  payment_method: PaymentMethod;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

// Response sau khi tạo đơn hàng thành công
export interface CheckoutResponse {
  success: boolean;
  order_id: string;
  payment_url?: string; // Redirect đến đây để thanh toán
  message?: string;
}

// Labels hiển thị trạng thái đơn hàng
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "⏳ Chờ thanh toán",
  paid: "✅ Đã thanh toán",
  shipped: "🚚 Đang giao hàng",
  cancelled: "❌ Đã hủy",
};

// Colors cho badge trạng thái
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#f59e0b",
  paid: "#10b981",
  shipped: "#3b82f6",
  cancelled: "#ef4444",
};
