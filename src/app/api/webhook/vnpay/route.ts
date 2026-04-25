// src/app/api/webhook/vnpay/route.ts
// POST /api/webhook/vnpay  (IPN - Instant Payment Notification)
// GET  /api/webhook/vnpay  (Return URL - redirect từ VNPay về)
// Chức năng:
//  1. Nhận callback từ VNPay sau khi thanh toán
//  2. Xác thực chữ ký HMAC-SHA512
//  3. Cập nhật trạng thái đơn hàng → PAID nếu thành công

import { NextRequest, NextResponse } from "next/server";

// IPN (server-to-server notification)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Xác thực vnp_SecureHash
    // const isValid = verifyVNPaySignature(body, process.env.VNPAY_HASH_SECRET!)
    // if (!isValid) return NextResponse.json({ RspCode: "97", Message: "Invalid signature" })

    const { vnp_ResponseCode, vnp_TxnRef } = body;

    if (vnp_ResponseCode === "00") {
      // TODO: Cập nhật order status = paid
      // await supabase.from("orders").update({ status: "paid" }).eq("id", vnp_TxnRef)

      console.log(`[VNPAY WEBHOOK] Order ${vnp_TxnRef} paid successfully`);
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
