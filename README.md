# Overlord Toys - Toy Store E-commerce

Website bán đồ chơi và mô hình sưu tầm, xây bằng **Next.js 15 App Router + TypeScript + Tailwind CSS + Supabase + PayOS + Resend**.

Project này đang tập trung vào hai nhóm chức năng chính:

- **Product Search**: tìm kiếm sản phẩm song ngữ Anh/Việt, có gợi ý sản phẩm khi người dùng đang nhập.
- **Account Settings**: cài đặt tài khoản, thông báo, phương thức thanh toán mặc định, ngôn ngữ giao diện và cách hiển thị tiền tệ.

---

## Tech Stack

| Phần | Công nghệ |
| --- | --- |
| Frontend | Next.js 15 App Router, React, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Payment | PayOS, COD, VNPay optional |
| Email | Resend |
| Storage | Supabase Storage cho ảnh sản phẩm |

---

## Cấu trúc chính

```txt
src/
  app/
    (shop)/
      page.tsx                 Trang chủ
      shop/                    Trang danh sách sản phẩm, filter, search
      product/[slug]/          Trang chi tiết sản phẩm
      cart/                    Giỏ hàng
      checkout/                Thanh toán
      success/                 Kết quả đặt hàng
      about/                   Giới thiệu
      account/                 Hồ sơ, đơn hàng, cài đặt
    api/
      checkout/route.ts        Tạo đơn hàng và payment link
      products/suggestions/    API gợi ý sản phẩm cho search dropdown
      resend/route.ts          Test gửi email
  components/
    product/                   Search, gallery, nút mua hàng
    settings/                  Price, LocalizedText, PreferenceGate
    layout/                    Header, Footer, user menu
  hooks/
    useAccountSettings.ts      Đọc/ghi settings theo từng user
    useCart.ts                 Giỏ hàng localStorage
    useUser.ts                 Auth/profile helper
  lib/
    account-settings.ts        Kiểu dữ liệu settings, format tiền, migrate setting cũ
    search.ts                  Chuẩn hóa và mở rộng keyword Anh/Việt
    products.ts                Query sản phẩm và áp dụng search/filter
```

---

## Account Settings

Route chính: `/account/settings`.

Settings được lưu trong `localStorage` theo từng user bằng key dạng:

```txt
account_settings:<userId>
```

Nếu chưa đăng nhập hoặc chưa có user id thì dùng key `account_settings:guest`.

### Các nhóm setting

| Nhóm | Setting | Tác dụng |
| --- | --- | --- |
| Notifications | Order updates | Khi bật, checkout gửi email xác nhận/cập nhật đơn hàng qua Resend. Khi tắt, đơn vẫn tạo bình thường nhưng bỏ qua email. |
| Notifications | Promotions | Khi bật, giỏ hàng hiển thị banner khuyến mãi và gợi ý voucher. Khi tắt, phần gợi ý khuyến mãi bị ẩn. |
| Notifications | Product recommendations | Khi bật, cart/product hiển thị khu vực gợi ý sản phẩm. Khi tắt, các khu vực này bị ẩn. |
| Shopping | Display language | Đổi giao diện giữa English và Tiếng Việt. |
| Shopping | Default payment method | Checkout tự chọn sẵn PayOS hoặc COD theo lựa chọn của user. |

### Đổi ngôn ngữ và tiền tệ

Setting ngôn ngữ hiện được dùng rộng hơn trước. Khi đổi sang **Tiếng Việt**, các phần giao diện khách hàng đã được dịch gồm:

- Header, menu tài khoản, footer.
- Trang chủ.
- Trang shop, tiêu đề shop, filter, badge, trạng thái tồn kho.
- Thanh tìm kiếm và dropdown gợi ý sản phẩm.
- Trang chi tiết sản phẩm, nút mua hàng, mô tả khu vực kỹ thuật.
- Cart, voucher, tổng tiền, khuyến mãi.
- Checkout, thông tin giao hàng, thanh toán, manifest đơn hàng.
- Success page sau khi đặt hàng.
- Account sidebar, hồ sơ, đổi mật khẩu, đơn hàng, settings.
- About page.

Tên sản phẩm và tên danh mục lấy từ database/mock data nên được giữ nguyên, vì đây là dữ liệu thật của sản phẩm. Ví dụ sản phẩm tên `One Piece Cursed Devil Fruit...` sẽ không bị tự dịch.

Giá sản phẩm vẫn **lưu bằng VND** trong database và trong logic thanh toán. Chỉ phần hiển thị đổi theo ngôn ngữ:

```txt
Tiếng Việt -> 2.700.000 VND
English    -> $108.00
```

Tỷ giá demo nằm trong `src/lib/account-settings.ts`:

```ts
export const VND_TO_USD_RATE = 25000;
```

Điều này giúp giao diện giống website thật hơn, nhưng không làm sai dữ liệu thanh toán vì PayOS/order API vẫn dùng giá gốc VND.

---

## Product Search

Project có các thanh tìm kiếm chính:

| Vị trí | Query dùng | Ghi chú |
| --- | --- | --- |
| Header search | `/shop?search=<keyword>` | Tìm từ mọi trang và chuyển về shop. |
| Shop search | `/shop?search=<keyword>` | Tìm ngay trong trang shop, kết hợp được với category/maxPrice. |
| Admin search | `/admin/products?q=<keyword>` | Lọc sản phẩm trong trang quản trị. |

Search đã được nâng cấp để gần giống website bán hàng thực tế:

- Có dropdown gợi ý sản phẩm khi người dùng đang nhập.
- Gợi ý gồm ảnh, tên sản phẩm, danh mục và giá.
- Hỗ trợ keyword tiếng Anh và tiếng Việt.
- Bỏ dấu tiếng Việt khi so khớp, ví dụ `do choi` vẫn có thể khớp với `đồ chơi`.
- Có nhóm từ đồng nghĩa Anh/Việt, ví dụ `toy/do choi`, `figure/mo hinh`, `lamp/den`, `car/xe`.
- Header search và shop search không còn mở dropdown chồng lên nhau sau khi Enter, vì mỗi thanh chỉ mở suggestion khi input của chính nó đang focus.

Luồng search:

```txt
Người dùng nhập keyword
  -> ProductSearchForm/AdminTopSearch debounce khoảng 180ms
  -> gọi GET /api/products/suggestions?search=<keyword>
  -> API gọi getProducts({ search, limit: 6 })
  -> getProducts lấy dữ liệu Supabase
  -> productMatchesSearch() chuẩn hóa và so khớp keyword Anh/Việt
  -> dropdown hiển thị tối đa 6 gợi ý
  -> Enter hoặc "xem tất cả" cập nhật URL /shop?search=...
```

Các file quan trọng:

- `src/lib/search.ts`: chuẩn hóa keyword, bỏ dấu, mở rộng nhóm từ Anh/Việt.
- `src/lib/products.ts`: lấy sản phẩm, join category, áp dụng search/filter.
- `src/app/api/products/suggestions/route.ts`: API trả gợi ý sản phẩm.
- `src/components/product/ProductSearchForm.tsx`: search ở Header và Shop.
- `src/components/admin/AdminTopSearch.tsx`: search trong Admin.

---

## Checkout, Email Và Resend

Luồng mua hàng:

```txt
Cart
  -> Checkout
  -> POST /api/checkout
  -> tạo order trong Supabase
  -> nếu PayOS thì tạo payment link
  -> nếu COD thì đi thẳng success
  -> nếu Order updates bật thì gửi email qua Resend
```

Lưu ý Resend:

- `RESEND_API_KEY` lấy trong Resend Dashboard.
- `RESEND_FROM_EMAIL` có thể dùng `Overlord Toys <onboarding@resend.dev>` để test.
- Với sender mặc định `onboarding@resend.dev`, Resend thường chỉ cho gửi tới email tài khoản test.
- Muốn gửi tới email khách hàng bất kỳ, cần verify domain riêng trong Resend rồi đổi sender sang email thuộc domain đó.

---

## Biến môi trường

Tạo file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Overlord Toys <onboarding@resend.dev>"
```

---

## Chạy project

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:3000
```

Build kiểm tra:

```bash
npm run build
```

---

## Trạng thái hiện tại

- [x] Trang bán đồ chơi cơ bản.
- [x] Supabase products/auth/orders.
- [x] Cart, checkout, PayOS/COD flow.
- [x] Resend order email có bật/tắt bằng `Order updates`.
- [x] Product Search song ngữ Anh/Việt.
- [x] Search suggestions giống website bán hàng thực tế.
- [x] Sửa lỗi dropdown search bị mở chồng giữa Header và Shop.
- [x] Account Settings đổi ngôn ngữ English/Tiếng Việt.
- [x] Giá tiền hiển thị theo ngôn ngữ: English dùng USD, Tiếng Việt dùng VND.
- [x] Dịch các trang khách hàng chính theo setting ngôn ngữ.
- [ ] Đồng bộ settings lên database để dùng chung nhiều thiết bị.
