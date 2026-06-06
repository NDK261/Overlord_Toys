"use server";

import { createAdminClient } from "@/lib/supabase/admin";

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
  
  return { success: true };
}
