"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail } from "@/lib/smtp";

export async function forceUpdateOrderToPaid(orderId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);
    
  if (error) {
    console.error("Failed to force update order:", error);
    return { success: false, error: error.message };
  }
  
  // Fetch full order details to send email
  const { data: fullOrder } = await supabase
    .from("orders")
    .select("customer_name, customer_email, customer_address, total_price")
    .eq("id", orderId)
    .single();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("quantity, price, products(name)")
    .eq("order_id", orderId);

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
      console.log(`[ACTION] Email sent for order ${orderId}`);
    } catch (emailError) {
      console.error(`[ACTION] Failed to send email for order ${orderId}`, emailError);
    }
  }

  return { success: true };
}
