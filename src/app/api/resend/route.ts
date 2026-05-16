// src/app/api/resend/route.ts
// POST /api/resend - send a simple order confirmation email through Resend.

import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, orderId, customerName, items, totalPrice, shippingAddress } = body;

    if (!to || !orderId) {
      return NextResponse.json(
        { error: "Missing email or order id" },
        { status: 400 }
      );
    }

    await sendOrderConfirmationEmail({
      to,
      orderId,
      customerName: customerName || "Customer",
      items: Array.isArray(items) ? items : [],
      totalPrice: Number(totalPrice || 0),
      shippingAddress: shippingAddress || "Not provided",
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${to}`,
    });
  } catch (error) {
    console.error("[RESEND ERROR]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not send email. Please try again.",
      },
      { status: 500 }
    );
  }
}
