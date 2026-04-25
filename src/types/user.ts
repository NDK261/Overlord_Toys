// src/types/user.ts
// TypeScript types cho người dùng - ánh xạ với Supabase Auth + profiles table

export type UserRole = "user" | "admin";

// Bảng profiles trong Supabase (mở rộng Supabase Auth)
export interface UserProfile {
  id: string; // uuid - khớp với auth.users.id
  full_name: string | null; // tên hiển thị
  role: UserRole; // phân quyền
  avatar_url?: string | null; // ảnh đại diện (Supabase Storage)
  phone?: string | null; // số điện thoại
  created_at?: string; // ISO timestamp
}

// Form đăng nhập
export interface LoginFormData {
  email: string;
  password: string;
}

// Form đăng ký
export interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Form cập nhật profile
export interface UpdateProfileInput {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

// Địa chỉ giao hàng (lưu trong profile hoặc truyền khi checkout)
export interface ShippingAddress {
  full_name: string;
  phone: string;
  province: string; // Tỉnh/Thành phố
  district: string; // Quận/Huyện
  ward: string; // Phường/Xã
  street: string; // Số nhà, đường
}
