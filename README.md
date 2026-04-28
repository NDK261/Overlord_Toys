# 🧸 Toy Store E-commerce

> Website bán đồ chơi trực tuyến — **Next.js 15 App Router + Supabase + PayOS/VNPay + Resend**

---

## 🚀 Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript |
| **Styling** | Tailwind CSS 4, CSS Modules |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (Email + OAuth) |
| **Storage** | Supabase Storage (ảnh sản phẩm) |
| **Payment** | PayOS (ưu tiên), VNPay (optional) |
| **Email** | Resend |
| **Analytics** | Google Analytics 4, Vercel Analytics |
| **Deployment** | Vercel |

---

## 📁 Cấu trúc thư mục

```
src/
├── app/
│    ├── (shop)/                        # Route group: cửa hàng
│    │     ├── page.tsx                 # / → Trang chủ
│    │     ├── products/                # /products → Danh sách sản phẩm (v2)
│    │     ├── product/                 # /product/[slug] → Chi tiết sản phẩm (v2)
│    │     ├── shop/                    # /shop → Trang cửa hàng chính (có Filter)
│    │     ├── cart/                    # /cart → Giỏ hàng
│    │     ├── checkout/                # /checkout → Thanh toán
│    │     ├── account/                 # /account → Thông tin cá nhân
│    │     ├── about/                   # /about → Giới thiệu
│    │     └── success/                 # /success → Thanh toán thành công
│    │
│    ├── (auth)/                        # Route group: xác thực
│    │     ├── login/                   # /login
│    │     ├── register/                # /register
│    │     ├── forgot-password/         # /forgot-password
│    │     └── profile/                 # /profile (v1)
│    │
│    ├── admin/                         # Quản trị (protected)
│    │     ├── page.tsx                 # /admin → Dashboard
│    │     ├── products/                # /admin/products → CRUD sản phẩm
│    │     └── orders/                  # /admin/orders → Quản lý đơn hàng
│    │
│    ├── api/
│    │     ├── checkout/route.ts        # POST /api/checkout
│    │     ├── webhook/payos/route.ts   # POST /api/webhook/payos
│    │     ├── webhook/vnpay/route.ts   # POST/GET /api/webhook/vnpay
│    │     ├── resend/route.ts          # POST /api/resend
│    │     └── test-supabase/           # API test kết nối DB
│    │
│    ├── layout.tsx                     # Root layout
│    └── globals.css                    # Tailwind + custom styles
│
├── components/
│    ├── ui/                            # Reusable UI components
│    ├── layout/                        # Navbar, Footer, layout wrappers
│    └── product/                       # ProductCard, ProductGallery, v.v.
│
├── lib/
│    ├── supabaseClient.ts              # Supabase client (browser + server)
│    ├── mock-data.ts                   # Dữ liệu mẫu ban đầu
│    ├── products.ts                    # Services lấy dữ liệu sản phẩm
│    ├── payos.ts                       # PayOS integration logic
│    ├── vnpay.ts                       # VNPay integration logic
│    ├── resend.ts                      # Email service integration
│    └── utils.ts                       # Helpers: formatPrice, toSlug, v.v.
│
├── hooks/
│    ├── useCart.ts                     # Quản lý giỏ hàng (localStorage)
│    └── useUser.ts                     # Quản lý auth state
│
├── types/
│    ├── product.ts                     # Type definitions cho sản phẩm
│    ├── order.ts                       # Type definitions cho đơn hàng
│    └── user.ts                        # Type definitions cho người dùng
│
└── middleware.ts                       # Bảo vệ /admin/* và /profile bằng Supabase Auth
```

---

## 🔄 System Flow

### Flow A — Người dùng mua hàng
```
Trang chủ → Xem sản phẩm → Thêm vào giỏ → Checkout
→ Tạo Order trong Supabase → Redirect PayOS/VNPay
→ Webhook nhận callback → Update status = PAID
→ Gửi email xác nhận → Trang Success
```

### Flow B — Admin quản lý
```
Login → /admin (Middleware kiểm tra role) → Dashboard
→ CRUD sản phẩm + Upload ảnh Supabase Storage
→ Xem đơn hàng → Cập nhật trạng thái
```

---

## 🔌 API Endpoints

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| `POST` | `/api/checkout` | Tạo order + PayOS/VNPay payment link |
| `POST` | `/api/webhook/payos` | PayOS webhook → update order PAID |
| `POST` | `/api/webhook/vnpay` | VNPay IPN → update order PAID |
| `GET`  | `/api/webhook/vnpay` | VNPay return URL → redirect |
| `POST` | `/api/resend` | Gửi email xác nhận đơn hàng |
| `GET`  | `/api/test-supabase`| Kiểm tra kết nối database |

---

## 🗄️ Database Schema (Supabase)

```sql
-- Danh mục sản phẩm
categories (id, name, slug)

-- Sản phẩm
products (id, name, slug, description, price, stock, category_id, thumbnail_url, created_at)

-- Ảnh sản phẩm
product_images (id, product_id, url)

-- Đơn hàng
orders (id, order_code, user_id, customer_name, customer_phone, customer_email, customer_address, 
        total_price, shipping_fee, discount_amount, voucher_code, status, payment_method, payment_url, created_at)

-- Chi tiết đơn hàng
order_items (id, order_id, product_id, quantity, price)

-- Hồ sơ người dùng
profiles (id, full_name, role)   -- id mapping auth.users.id
```

---

## ⚙️ Setup

### 1. Clone và cài dependencies

```bash
git clone <repo>
cd web_ecommerce_toys
npm install
```

*Lưu ý: Nếu một số package chưa được cài, hãy bổ sung:*
`npm install @payos/node resend`

### 2. Cấu hình .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Cấu hình thanh toán (nếu có)
PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...
RESEND_API_KEY=...
```

### 3. Chạy development server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🔐 Auth & Authorization

- **Middleware** (`src/middleware.ts`) quản lý truy cập:
  - `/admin/*` yêu cầu login và `role === "admin"`.
  - `/profile` và `/account` yêu cầu login.
- Supabase Auth được cấu hình với mode `ssr`.

---

## 📦 Roadmap & Status

- [x] **Phase 1**: Khởi tạo project Next.js 15 + Tailwind 4.
- [x] **Phase 2**: Thiết kế UI Mockup (Home, Shop, Cart, Login/Register).
- [x] **Phase 3**: Kết nối Supabase (Products API, Auth logic). 
- [x] **Phase 4**: Admin Dashboard (CRUD sản phẩm cơ bản).
- [/] **Phase 5**: Tích hợp thanh toán thực tế (PayOS/VNPay) + Resend Email. *(PayOS: Đang tích hợp. VNPay/Resend: Chưa làm)*.
- [ ] **Phase 6**: Optimization & SEO.
