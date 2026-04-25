"use server";

import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createPublicServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true, data };
}
