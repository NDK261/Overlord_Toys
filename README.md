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
| **Payment** | PayOS (ưu tiên), VNPay (optional), COD |
| **Email** | Resend |
| **Analytics** | Google Analytics 4, Vercel Analytics |
| **Deployment** | Vercel |

---

## 📁 Cấu trúc thư mục

```txt
src/
├── app/
│   ├── (shop)/                        # Route group: cửa hàng
│   │   ├── page.tsx                   # / → Trang chủ
│   │   ├── shop/                      # /shop → Trang cửa hàng chính, search + filter
│   │   ├── product/                   # /product/[slug] → Chi tiết sản phẩm
│   │   ├── cart/                      # /cart → Giỏ hàng
│   │   ├── checkout/                  # /checkout → Thanh toán
│   │   ├── account/                   # /account → Hồ sơ, đơn hàng, settings
│   │   ├── about/                     # /about → Giới thiệu
│   │   └── success/                   # /success → Thanh toán/đặt hàng thành công
│   │
│   ├── (auth)/                        # Route group: xác thực
│   │   ├── login/                     # /login
│   │   ├── register/                  # /register
│   │   ├── forgot-password/           # /forgot-password
│   │   └── profile/                   # /profile (v1)
│   │
│   ├── admin/                         # Quản trị (protected)
│   │   ├── page.tsx                   # /admin → Dashboard
│   │   ├── products/                  # /admin/products → CRUD sản phẩm
│   │   └── orders/                    # /admin/orders → Quản lý đơn hàng
│   │
│   ├── api/
│   │   ├── checkout/route.ts          # POST /api/checkout
│   │   ├── products/suggestions/route.ts # GET /api/products/suggestions
│   │   ├── webhook/payos/route.ts     # POST /api/webhook/payos
│   │   ├── webhook/vnpay/route.ts     # POST/GET /api/webhook/vnpay
│   │   ├── resend/route.ts            # POST /api/resend
│   │   └── test-supabase/             # API test kết nối DB
│   │
│   ├── layout.tsx                     # Root layout
│   └── globals.css                    # Tailwind + custom styles
│
├── components/
│   ├── ui/                            # Reusable UI components
│   ├── admin/                         # AdminTopSearch cho trang quản trị sản phẩm
│   ├── layout/                        # Header, Footer, UserAuthSection
│   ├── product/                       # Product UI + ProductSearchForm
│   └── settings/                      # Price, LocalizedText, PreferenceGate
│
├── lib/
│   ├── supabaseClient.ts              # Supabase client
│   ├── mock-data.ts                   # Dữ liệu mẫu ban đầu
│   ├── products.ts                    # Services lấy/lọc/tìm kiếm sản phẩm
│   ├── search.ts                      # Chuẩn hóa keyword + search song ngữ Anh/Việt
│   ├── account-settings.ts            # Account Settings: language, payment, price format
│   ├── payos.ts                       # PayOS integration logic
│   ├── vnpay.ts                       # VNPay integration logic
│   ├── resend.ts                      # Email service integration
│   └── utils.ts                       # Helpers: formatPrice, toSlug, v.v.
│
├── hooks/
│   ├── useCart.ts                     # Quản lý giỏ hàng (localStorage)
│   ├── useUser.ts                     # Quản lý auth state
│   └── useAccountSettings.ts          # Đọc/ghi account settings theo từng user
│
├── types/
│   ├── product.ts                     # Type definitions cho sản phẩm
│   ├── order.ts                       # Type definitions cho đơn hàng
│   └── user.ts                        # Type definitions cho người dùng
│
└── middleware.ts                       # Bảo vệ /admin/*, /account/* và /profile
```

---

## 🔄 System Flow

### Flow A — Người dùng mua hàng

```txt
Trang chủ → Search/Header hoặc Shop filter → Xem sản phẩm → Thêm vào giỏ → Checkout
→ Tạo Order trong Supabase → Redirect PayOS nếu thanh toán online
→ Webhook nhận callback → Update status = PAID
→ Gửi email xác nhận nếu user bật Order updates → Trang Success
```

### Flow B — Admin quản lý

```txt
Login → /admin (Middleware kiểm tra role) → Dashboard
→ Search sản phẩm trong admin → CRUD sản phẩm + Upload ảnh Supabase Storage
→ Xem đơn hàng → Cập nhật trạng thái
```

### Flow C — Người dùng cấu hình Settings

```txt
Login → /account/settings
→ Bật/tắt Order updates, Promotions, Product recommendations
→ Chọn Display language (English/Tiếng Việt)
→ Chọn Default payment method (PayOS/COD)
→ Save preferences vào localStorage theo user
→ Header/Shop/Product/Cart/Checkout/Account/About đọc settings và đổi UI tương ứng
```

---

## 🔌 API Endpoints

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| `POST` | `/api/checkout` | Tạo order + PayOS/VNPay payment link |
| `GET` | `/api/products/suggestions` | Trả về gợi ý sản phẩm theo keyword search Anh/Việt |
| `POST` | `/api/webhook/payos` | PayOS webhook → update order PAID |
| `POST` | `/api/webhook/vnpay` | VNPay IPN → update order PAID |
| `GET` | `/api/webhook/vnpay` | VNPay return URL → redirect |
| `POST` | `/api/resend` | Gửi email xác nhận đơn hàng |
| `GET` | `/api/test-supabase` | Kiểm tra kết nối database |

---

## ⚙️ Account Settings

Route chính: `/account/settings` (được bảo vệ bởi middleware, yêu cầu đăng nhập).

Trang Settings hiện có các nhóm chức năng:

| Nhóm | Chức năng | Tác động thật trong app |
|------|-----------|--------------------------|
| **Notification Preferences** | `Order updates` | Khi bật, checkout gửi email xác nhận đơn hàng qua Resend. Khi tắt, order vẫn tạo nhưng bỏ qua email. |
| **Notification Preferences** | `Promotions` | Khi bật, cart hiển thị promo broadcast và voucher suggestions. Khi tắt, ẩn các gợi ý khuyến mãi. |
| **Notification Preferences** | `Product recommendations` | Khi bật, cart/product hiển thị Recently Viewed và Recommended Archives. Khi tắt, ẩn các khu vực gợi ý. |
| **Shopping Preferences** | `Display language` (`English`/`Tiếng Việt`) | Đổi ngôn ngữ giao diện ở các trang khách hàng chính. Tên sản phẩm/danh mục lấy từ dữ liệu web nên được giữ nguyên. |
| **Shopping Preferences** | `Default payment method` (`PayOS`/`COD`) | Checkout tự chọn sẵn phương thức thanh toán theo setting đã lưu. |
| **Account Session** | `Sign out` | Đăng xuất khỏi Supabase session và refresh UI. |

Settings được lưu ở browser `localStorage` theo từng user thông qua `useAccountSettings`.
Điều này đủ tốt cho đồ án/demo. Nếu cần đồng bộ nhiều thiết bị, có thể mở rộng bằng cách lưu settings vào Supabase.

### Bổ sung mới: đổi ngôn ngữ và tiền tệ

Trước đây phần Settings chủ yếu đổi một vài label đơn giản. Hiện tại `Display language` đã được mở rộng để giống website thực tế hơn:

- Khi chọn **Tiếng Việt**, các phần UI khách hàng như Header, Footer, Account, Orders, About, Home, Product detail, Cart, Checkout, Success, Shop và Search sẽ chuyển sang tiếng Việt.
- Khi chọn **English**, các phần đó hiển thị lại bằng tiếng Anh.
- Tên sản phẩm và tên danh mục không bị tự dịch vì đây là dữ liệu sản phẩm có sẵn trong web/database.
- Giá sản phẩm vẫn lưu bằng VND để không ảnh hưởng logic thanh toán, nhưng phần hiển thị sẽ đổi theo ngôn ngữ:

```txt
Tiếng Việt → 2.700.000 VND
English    → $108.00
```

Tỷ giá demo nằm trong:

```txt
src/lib/account-settings.ts
```

```ts
export const VND_TO_USD_RATE = 25000;
```

Các component liên quan:

- `src/components/settings/Price.tsx`: hiển thị giá theo ngôn ngữ.
- `src/components/settings/LocalizedText.tsx`: dùng cho một số text ở server page cần đọc language setting.
- `src/lib/account-settings.ts`: định nghĩa `language`, format giá, migrate setting cũ từ `currency`.

---

## 🔎 Product Search

Project hiện có 3 thanh tìm kiếm sản phẩm, được nâng cấp theo hướng gần với website bán hàng thực tế:

| Vị trí | Route/query dùng | Cách tìm | Ghi chú |
|-------|------------------|----------|--------|
| **Header** `Search toys...` / `Tìm đồ chơi...` | `/shop?search=<keyword>` | Tìm theo `name`, `description`, `slug`, `category name`, `category slug`, có chuẩn hóa dấu tiếng Việt và mở rộng từ khóa Anh/Việt. | Đây là search global. Dù đang ở Home/Product/Cart, nhập từ khóa sẽ chuyển về trang Shop để hiển thị kết quả. |
| **Shop page** `Search product name...` / `Tìm tên sản phẩm...` | `/shop?search=<keyword>` | Dùng cùng logic song ngữ với Header, đồng thời vẫn giữ được filter `category` và `maxPrice`. | Ví dụ `/shop?search=xe điều khiển&category=rc-car&maxPrice=5000000`. |
| **Admin** `Scan products...` | `/admin/products?q=<keyword>` | Dùng cùng logic search song ngữ để lọc sản phẩm quản trị, vẫn hỗ trợ tìm theo product id. | Dành cho admin lọc danh sách sản phẩm để sửa/xóa/quản lý nhanh hơn. |

Luồng hoạt động khi người dùng gõ:

```txt
Người dùng nhập keyword
→ ProductSearchForm/AdminTopSearch debounce khoảng 180ms
→ Gọi GET /api/products/suggestions?search=<keyword>
→ API dùng getProducts({ search, category, maxPrice, limit: 6 })
→ getProducts lấy dữ liệu Supabase rồi lọc bằng productMatchesSearch()
→ Dropdown hiển thị gợi ý sản phẩm gồm ảnh, tên, danh mục và giá
→ Bấm gợi ý sẽ mở thẳng product detail hoặc admin edit page
→ Bấm Enter hoặc "View all results" sẽ cập nhật URL /shop?search=...
```

Các điểm đã sửa/bổ sung:

- Search hỗ trợ cả tiếng Anh và tiếng Việt.
- Có bỏ dấu tiếng Việt khi tìm, ví dụ `do choi`, `đồ chơi`, `do choi one piece` đều dễ khớp hơn.
- Có nhóm từ đồng nghĩa Anh/Việt như `toy/do choi`, `figure/mo hinh`, `lamp/den`, `car/xe`.
- Dropdown gợi ý sản phẩm hiện theo keyword đang nhập.
- Header search và Shop search không còn bị mở gợi ý chồng lên nhau sau khi nhấn Enter.
- Mỗi search box chỉ mở dropdown khi chính input đó đang focus.
- Giá trong dropdown cũng dùng `Price`/`formatAccountPrice`, nên đổi theo language setting.

Các file chính:

- `src/lib/search.ts`: chuẩn hóa keyword, bỏ dấu tiếng Việt, đổi `đ` thành `d`, mở rộng nhóm từ đồng nghĩa.
- `src/lib/products.ts`: lấy sản phẩm từ Supabase, join thêm `categories`, áp dụng `productMatchesSearch`.
- `src/app/api/products/suggestions/route.ts`: API trả về tối đa 6 gợi ý sản phẩm cho dropdown.
- `src/components/product/ProductSearchForm.tsx`: dùng cho Header và trang Shop.
- `src/components/admin/AdminTopSearch.tsx`: dùng cho thanh search trong admin layout.

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
profiles (id, full_name, role) -- id mapping auth.users.id
```

---

## ⚙️ Setup

### 1. Clone và cài dependencies

```bash
git clone <repo>
cd web_ecommerce_toys
npm install
```

Các package chính đã có trong `package.json`, bao gồm `@payos/node`, `@supabase/ssr`, `@supabase/supabase-js` và `resend`.

### 2. Cấu hình `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cấu hình thanh toán
PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...

# Cấu hình email
RESEND_API_KEY=...
RESEND_FROM_EMAIL=Overlord Toys <onboarding@resend.dev>
```

Ghi chú Resend:

- `RESEND_API_KEY` lấy trong Resend Dashboard → API Keys.
- `RESEND_FROM_EMAIL` có thể dùng `Overlord Toys <onboarding@resend.dev>` để test.
- Với sender mặc định `onboarding@resend.dev`, Resend thường chỉ cho gửi tới email tài khoản test.
- Muốn gửi tới mọi email khách hàng, cần verify domain trong Resend và đổi sender sang email domain riêng.

### 3. Chạy development server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🔐 Auth & Authorization

- **Middleware** (`src/middleware.ts`) quản lý truy cập:
  - `/admin/*` yêu cầu login và `role === "admin"`.
  - `/profile` và `/account/*` yêu cầu login.
- Login hỗ trợ `callbackUrl`, nên nếu user vào `/account/settings` khi chưa đăng nhập thì đăng nhập xong sẽ quay lại đúng trang Settings.
- Supabase Auth được cấu hình với mode `ssr`.

---

## 📦 Roadmap & Status

- [x] **Phase 1**: Khởi tạo project Next.js 15 + Tailwind 4.
- [x] **Phase 2**: Thiết kế UI Mockup (Home, Shop, Cart, Login/Register).
- [x] **Phase 3**: Kết nối Supabase (Products API, Auth logic).
- [x] **Phase 4**: Admin Dashboard (CRUD sản phẩm cơ bản + search sản phẩm trong admin).
- [x] **Product Search**: Header search, Shop search, admin search, search song ngữ Anh/Việt, bỏ dấu tiếng Việt, mở rộng từ đồng nghĩa và dropdown gợi ý sản phẩm theo keyword đang nhập.
- [x] **Account Settings**: notification preferences, display language English/Tiếng Việt, default payment method, Resend order email theo `Order updates`.
- [x] **Language & Price Display**: đổi ngôn ngữ các trang khách hàng chính và đổi giá hiển thị theo language setting (`VND` cho Tiếng Việt, `USD` cho English).
- [/] **Phase 6**: Tích hợp thanh toán thực tế (PayOS/VNPay) + email production. *(PayOS/COD: đã có luồng cơ bản. Resend: đã implement, cần API key/domain để gửi thật. VNPay: optional)*.
- [ ] **Phase 7**: Optimization & SEO.
