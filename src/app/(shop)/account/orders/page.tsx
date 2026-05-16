import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersList } from "./OrdersList";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = createPublicServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?callbackUrl=/account/orders");
  }

  // Lấy danh sách đơn hàng kèm số lượng sản phẩm (count) trực tiếp trên server
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(id)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <OrdersList 
      initialOrders={orders || []} 
      userEmail={session.user.email || ""} 
    />
  );
}
