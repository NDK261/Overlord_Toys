// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PaymentFactory } from "@/lib/payment/PaymentFactory";
import { sendOrderConfirmationEmail } from "@/lib/smtp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customerInfo,
      paymentMethod,
      vouchers: appliedVouchers,
      notificationSettings,
    } = body;
    const shouldSendOrderUpdates = notificationSettings?.orderUpdates !== false;

    if (!items || items.length === 0 || !customerInfo || !paymentMethod) {
      return NextResponse.json({ error: "Thiếu thông tin đơn hàng" }, { status: 400 });
    }

    const { vouchers: voucherList } = require("@/lib/vouchers");
    const supabase = createPublicServerSupabaseClient();
    
    // Get current user if exists
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Lấy thông tin sản phẩm thực tế từ Database để xác thực giá và tồn kho
    const productIds = items.map((item: any) => item.product.id);
    const { data: dbProducts, error: dbProductsError } = await supabase
      .from("products")
      .select("id, name, price, stock")
      .in("id", productIds);

    if (dbProductsError || !dbProducts) {
      return NextResponse.json({ error: "Không thể xác thực thông tin sản phẩm từ database" }, { status: 500 });
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Kiểm tra hàng tồn kho trước khi thanh toán
    for (const item of items) {
      const dbProduct = productMap.get(item.product.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Sản phẩm ${item.product.name} không tồn tại trên hệ thống` }, { status: 400 });
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Sản phẩm ${dbProduct.name} không đủ hàng tồn kho. Chỉ còn lại ${dbProduct.stock} sản phẩm.` 
        }, { status: 400 });
      }
    }

    // Tính tổng tiền sản phẩm (Dựa trên giá gốc trong database để tránh sửa giá từ client)
    const subtotal = items.reduce((sum: number, item: any) => {
      const dbProduct = productMap.get(item.product.id);
      return sum + (dbProduct?.price || 0) * item.quantity;
    }, 0);

    // 2. Tính toán Voucher (Securely on server)
    const findVoucher = (code: string | undefined) => {
      if (!code) return null;
      return voucherList.find((v: any) => v.code.toUpperCase() === code.toUpperCase()) || null;
    };

    const freeshipVoucher = findVoucher(appliedVouchers?.freeship);
    const discountVoucher = findVoucher(appliedVouchers?.discount);

    // Shipping calculation
    const baseShippingFee = subtotal > 2000000 ? 0 : 30000;
    // Logic Freeship 3 trường hợp:
    // 1. Đơn hàng đầu tiên của tài khoản
    // 2. Giá trị đơn hàng > 1.000.000đ
    // 3. Có nhập mã FREESHIP (hoặc bất kỳ voucher freeship nào được áp dụng)
    let shippingDiscount = 0;
    let isFirstOrder = false;

    if (user) {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      isFirstOrder = count === 0;
    }

    const isFreeshipEligible = isFirstOrder || subtotal >= 1000000 || !!appliedVouchers?.freeship;

    if (isFreeshipEligible) {
      shippingDiscount = 30000; // Miễn phí vận chuyển (giảm tối đa 30k)
    }

    const finalShippingFee = Math.max(0, baseShippingFee - shippingDiscount);

    // Order discount calculation
    let orderDiscount = 0;
    if (discountVoucher && subtotal >= discountVoucher.minOrder) {
      if (discountVoucher.rewardType === "percentage") {
        orderDiscount = Math.floor((subtotal * discountVoucher.rewardValue) / 100);
      } else {
        orderDiscount = discountVoucher.rewardValue;
      }
    }

    const totalPrice = Math.max(0, subtotal + finalShippingFee - orderDiscount);

    // 3. Tạo đơn hàng trong table `orders`
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_email: customerInfo.email,
        total_price: totalPrice,
        status: paymentMethod === "cod" ? "processing" : "pending",
        payment_method: paymentMethod,
        shipping_fee: finalShippingFee,
        discount_amount: orderDiscount,
        voucher_code: appliedVouchers?.discount || appliedVouchers?.freeship || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Tạo chi tiết đơn hàng `order_items`
    const orderItems = items.map((item: any) => {
      const dbProduct = productMap.get(item.product.id);
      return {
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: dbProduct?.price || 0,
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    // Trừ kho hàng đối với đơn hàng COD (Thanh toán khi nhận hàng)
    if (paymentMethod === "cod") {
      const adminSupabase = createAdminClient();
      for (const item of items) {
        const dbProduct = productMap.get(item.product.id);
        if (dbProduct) {
          const newStock = Math.max(0, dbProduct.stock - item.quantity);
          const { error: stockError } = await adminSupabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", dbProduct.id);
            
          if (stockError) {
            console.error(`[CHECKOUT STOCK ERROR] Không thể cập nhật tồn kho cho sản phẩm ${dbProduct.name}:`, stockError.message);
          } else {
            console.log(`[CHECKOUT STOCK] Cập nhật tồn kho sản phẩm ${dbProduct.name}: ${dbProduct.stock} -> ${newStock}`);
          }
        }
      }
    }


    // 4. Xử lý thanh toán thông qua PaymentFactory (Factory Method Pattern)
    const paymentProvider = PaymentFactory.getProvider(paymentMethod);
    const orderCode = Number(String(Date.now()).slice(-9));
    
    const paymentUrl = await paymentProvider.createPaymentLink({
      orderId: order.id,
      orderCode,
      amount: totalPrice,
      description: `Thanh toan DH #${orderCode}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success?orderId=${order.id}`,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
      },
      items: items.map((item: any) => ({
        name: item.product.name.slice(0, 20),
        quantity: item.quantity,
        price: item.product.price,
      })),
    });

    // Cập nhật URL thanh toán vào đơn hàng nếu có (dành cho PayOS, VNPay...)
    if (paymentUrl) {
      await supabase
        .from("orders")
        .update({ payment_url: paymentUrl })
        .eq("id", order.id);
    }

    // Send email immediately only for COD. For PayOS, the webhook will handle it when paid.
    if (shouldSendOrderUpdates && paymentMethod === "cod") {
      try {
        await sendOrderConfirmationEmail({
          to: customerInfo.email,
          orderId: order.id,
          customerName: customerInfo.name,
          shippingAddress: customerInfo.address,
          totalPrice,
          items: items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        });
      } catch (emailError) {
        console.error("[ORDER EMAIL ERROR]", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl,
      orderUpdatesEmail: shouldSendOrderUpdates ? "enabled" : "disabled",
    });
  } catch (error: any) {
    console.error("[CHECKOUT ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Lỗi server, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
