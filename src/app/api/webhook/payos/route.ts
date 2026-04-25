// src/app/api/webhook/payos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { verifyPayOSWebhookData } from "@/lib/payos";

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
      const supabase = createPublicServerSupabaseClient();

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
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PAYOS WEBHOOK ERROR]", error);
    // Vẫn trả về 200 để PayOS không gửi lại webhook liên tục nếu lỗi logic của ta
    return NextResponse.json({ success: false, message: "Webhook processed with error" });
  }
}
