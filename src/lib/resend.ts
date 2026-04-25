// src/lib/resend.ts
// Gửi email qua Resend
// Docs: https://resend.com/docs
// Cài: npm install resend

export interface OrderEmailData {
  to: string;
  orderId: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  shippingAddress: string;
}

/**
 * Gửi email xác nhận đơn hàng
 */
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<void> {
  // TODO: Cài resend và implement
  // const { Resend } = require("resend")
  // const resend = new Resend(process.env.RESEND_API_KEY)
  //
  // await resend.emails.send({
  //   from: "Toy Store <orders@yourdomain.com>",
  //   to: data.to,
  //   subject: `✅ Xác nhận đơn hàng #${data.orderId} - Toy Store`,
  //   html: generateOrderHTML(data),
  // })

  console.log(`[RESEND] Sending order confirmation to ${data.to}`);
}

/**
 * Tạo HTML template email xác nhận đơn hàng
 */
function generateOrderHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) =>
        `<tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString("vi-VN")}đ</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>🧸 Toy Store - Xác nhận đơn hàng</h1>
      <p>Xin chào <strong>${data.customerName}</strong>,</p>
      <p>Đơn hàng <strong>#${data.orderId}</strong> của bạn đã được xác nhận!</p>
      
      <table border="1" cellpadding="8" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th></tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
        <tfoot>
          <tr>
            <td colspan="2"><strong>Tổng cộng</strong></td>
            <td><strong>${data.totalPrice.toLocaleString("vi-VN")}đ</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <p>Địa chỉ giao hàng: ${data.shippingAddress}</p>
      <p>Cảm ơn bạn đã tin tưởng mua sắm tại Toy Store! 🎉</p>
    </div>
  `;
}

// Export để dùng trong tests
export { generateOrderHTML };
