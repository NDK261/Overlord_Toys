// src/app/api/webhook/payos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPayOSWebhookData } from "@/lib/payos";
import { sendOrderConfirmationEmail } from "@/lib/smtp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Xác thực dữ liệu Webhook
    // PayOS tự động kiểm tra signature khi gọi hàm này
    const webhookData = verifyPayOSWebhookData(body);
    
    if (!webhookData) {
      return NextResponse.json({ error: "Invalid webhook data" }, { status: 400 });
    }

    const { orderCode, success } = webhookData;

    // 2. Kiểm tra thanh toán thành công
    if (success) {
      const supabase = createAdminClient();

      // Cập nhật order status = paid
      // Lưu ý: Trong hệ thống của ta, id của order là UUID, nhưng PayOS dùng số orderCode.
      // Do đó, ta cần tìm order có payment_url chứa orderCode hoặc lưu mapping.
      // Cách đơn giản nhất là tìm order có status 'pending' và payment_method 'payos' có total_price khớp.
      // NHƯNG tốt nhất là ta nên lưu order_code vào bảng orders.
      
      // TẠM THỜI: Ta giả định orderCode được lưu trong metadata hoặc query theo payment_url.
      const { data: orders, error: fetchError } = await supabase
        .from("orders")
        .select("id")
        .eq("status", "pending")
        .eq("payment_method", "payos")
        .filter("payment_url", "ilike", `%${orderCode}%`)
        .limit(1);

      if (orders && orders.length > 0) {
        const orderId = orders[0].id;
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId);
        
        console.log(`[PAYOS WEBHOOK] Order ${orderId} marked as PAID`);

        // Fetch full order details to send email
        const { data: fullOrder } = await supabase
          .from("orders")
          .select("customer_name, customer_email, customer_address, total_price")
          .eq("id", orderId)
          .single();

        const { data: orderItems } = await supabase
          .from("order_items")
          .select("product_id, quantity, price, products(name)")
          .eq("order_id", orderId);

        // Trừ kho hàng đối với đơn hàng online PayOS thành công
        if (orderItems) {
          for (const item of orderItems) {
            if (item.product_id) {
              const { data: dbProd } = await supabase
                .from("products")
                .select("stock")
                .eq("id", item.product_id)
                .single();
              if (dbProd) {
                const newStock = Math.max(0, dbProd.stock - item.quantity);
                await supabase
                  .from("products")
                  .update({ stock: newStock })
                  .eq("id", item.product_id);
              }
            }
          }
        }

        if (fullOrder && fullOrder.customer_email && orderItems) {
          try {
            await sendOrderConfirmationEmail({
              to: fullOrder.customer_email,
              orderId: orderId,
              customerName: fullOrder.customer_name || "Customer",
              shippingAddress: fullOrder.customer_address || "Not provided",
              totalPrice: fullOrder.total_price,
              items: orderItems.map((item: any) => ({
                name: item.products?.name || "Unknown Product",
                quantity: item.quantity,
                price: item.price,
              })),
            });
            console.log(`[PAYOS WEBHOOK] Email sent for order ${orderId}`);
          } catch (emailError) {
            console.error(`[PAYOS WEBHOOK] Failed to send email for order ${orderId}`, emailError);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PAYOS WEBHOOK ERROR]", error);
    // Vẫn trả về 200 để PayOS không gửi lại webhook liên tục nếu lỗi logic của ta
    return NextResponse.json({ success: false, message: "Webhook processed with error" });
  }
}
