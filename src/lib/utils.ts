// src/lib/utils.ts
// Các helper functions dùng chung trong toàn dự án

/**
 * Format giá tiền sang định dạng VNĐ
 * @example formatPrice(150000) → "150.000đ"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("₫", "đ");
}

/**
 * Tạo slug từ chuỗi tiếng Việt
 * @example toSlug("Xe đồ chơi cho bé") → "xe-do-choi-cho-be"
 */
export function toSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Tạo mã order code dạng số (required bởi PayOS)
 * @returns số 6-8 chữ số unique
 */
export function generateOrderCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

/**
 * Lấy IP của người dùng từ request headers
 * Dùng cho VNPay
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

/**
 * Format ngày giờ sang định dạng Việt Nam
 * @example formatDate(new Date()) → "19/04/2026 10:30"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

/**
 * Rút gọn text nếu quá dài
 * @example truncate("Đây là chuỗi rất dài", 10) → "Đây là ch..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ
 */
export function isValidVietnamesePhone(phone: string): boolean {
  return /^(0|\+84)(3[2-9]|5[6-9]|7[0-9]|8[0-9]|9[0-9])\d{7}$/.test(phone);
}

/**
 * Delay helper (dùng cho debounce, retry, etc.)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
