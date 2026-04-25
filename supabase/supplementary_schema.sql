-- ==========================================
-- SQL BỔ SUNG CHO HỆ THỐNG OVERLORD TOYS
-- Copy và chạy các lệnh này trong Supabase SQL Editor
-- ==========================================

-- 1. NÂNG CẤP BẢNG PROFILES (HỒ SƠ NGƯỜI DÙNG)
-- Thêm các trường cần thiết cho Account & Checkout
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. TỰ ĐỘNG HÓA TẠO PROFILE (TRIGGER)
-- Hàm xử lý khi có user mới đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Collector'), 
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gỡ trigger cũ nếu có và tạo lại
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. CHÍNH SÁCH BẢO MẬT (RLS) CHO PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. BẢNG VOUCHERS (MÃ GIẢM GIÁ)
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'freeship' hoặc 'discount'
  reward_type VARCHAR(20) NOT NULL, -- 'fixed' hoặc 'percentage'
  reward_value BIGINT NOT NULL,
  min_order BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active vouchers" ON public.vouchers;
CREATE POLICY "Anyone can view active vouchers" ON public.vouchers
  FOR SELECT USING (is_active = true);

-- 5. NÂNG CẤP BẢNG ORDERS (ĐƠN HÀNG)
-- Lưu trữ chi tiết tài chính và mã giảm giá đã dùng
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_fee BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(50);

-- 6. TÍNH NĂNG MỞ RỘNG: WISHLIST & REVIEWS
-- Bảng Wishlist (Yêu thích)
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Bảng Reviews (Đánh giá sản phẩm)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist;
CREATE POLICY "Users manage own wishlist" ON public.wishlist
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Logged in users can review" ON public.reviews;
CREATE POLICY "Logged in users can review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
