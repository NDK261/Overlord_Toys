// src/app/api/webhook/vnpay/route.ts
// POST /api/webhook/vnpay  (IPN - Instant Payment Notification)
// GET  /api/webhook/vnpay  (Return URL - redirect từ VNPay về)
// Chức năng:
//  1. Nhận callback từ VNPay sau khi thanh toán
//  2. Xác thực chữ ký HMAC-SHA512
//  3. Cập nhật trạng thái đơn hàng → PAID nếu thành công

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// IPN (server-to-server notification)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Xác thực vnp_SecureHash
    // const isValid = verifyVNPaySignature(body, process.env.VNPAY_HASH_SECRET!)
    // if (!isValid) return NextResponse.json({ RspCode: "97", Message: "Invalid signature" })

    const { vnp_ResponseCode, vnp_TxnRef } = body;

    if (vnp_ResponseCode === "00") {
      const supabase = createAdminClient();

      // Cập nhật trạng thái đơn hàng = paid
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", vnp_TxnRef)
        .eq("status", "pending")
        .select()
        .single();

      if (order) {
        console.log(`[VNPAY WEBHOOK] Order ${vnp_TxnRef} marked as PAID`);

        // Khấu trừ tồn kho của sản phẩm trong đơn hàng
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", vnp_TxnRef);

        if (orderItems) {
          for (const item of orderItems) {
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
    }

    // VNPay yêu cầu response format cụ thể
    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (error) {
    console.error("[VNPAY WEBHOOK ERROR]", error);
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }
}

// Return URL (redirect từ VNPay về trình duyệt người dùng)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const responseCode = searchParams.get("vnp_ResponseCode");
  const txnRef = searchParams.get("vnp_TxnRef");

  if (responseCode === "00") {
    // Redirect sang trang success
    return NextResponse.redirect(
      new URL(`/success?order=${txnRef}`, request.url)
    );
  }

  // Redirect sang trang thất bại
  return NextResponse.redirect(new URL("/checkout?error=payment_failed", request.url));
}
