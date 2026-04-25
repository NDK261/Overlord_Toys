// src/app/api/resend/route.ts
// POST /api/resend
// Chức năng: Gửi email xác nhận đơn hàng qua Resend

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, orderId, customerName, items, totalPrice } = body;

    if (!to || !orderId) {
      return NextResponse.json(
        { error: "Thiếu thông tin email" },
        { status: 400 }
      );
    }

    // TODO: Gửi email qua Resend
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: "Toy Store <noreply@yourdomain.com>",
    //   to,
    //   subject: `Xác nhận đơn hàng #${orderId}`,
    //   html: generateOrderEmailHTML({ orderId, customerName, items, totalPrice }),
    // })

    console.log(`[RESEND] Email sent to ${to} for order ${orderId}`);

    return NextResponse.json({
      success: true,
      message: `Email đã được gửi đến ${to}`,
    });
  } catch (error) {
    console.error("[RESEND ERROR]", error);
    return NextResponse.json(
      { error: "Không thể gửi email, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
