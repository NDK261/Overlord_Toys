"use server";

import { createAdminClient, verifyAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getAdminOrders() {
  try {
    await verifyAdmin();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin orders:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await verifyAdmin();
    const supabase = createAdminClient();
    
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
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

