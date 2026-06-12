import { createAdminClient } from "@/lib/supabase/admin";
const startOfDay = (d: Date) => {
  const newDate = new Date(d);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const subDays = (d: Date, days: number) => {
  const newDate = new Date(d);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

export async function getDashboardStats() {
  const supabase = createAdminClient();

  // 1. Total Revenue (completed or paid)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .in("status", ["completed", "paid"]);

  const totalRevenue = (revenueData || []).reduce(
    (sum, order) => sum + (order.total_price || 0),
    0
  );

  // 2. Total Orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 3. Total Products (active stock)
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .gt("stock", 0);

  // 4. Pending Orders
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return {
    totalRevenue,
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    pendingOrders: pendingOrders || 0,
  };
}

export async function getRecentOrders(limit = 4) {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return orders || [];
}

export async function getRevenueMetrics() {
  const supabase = createAdminClient();
  
  // Get last 7 days
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 6);

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_price")
    .in("status", ["completed", "paid"])
    .gte("created_at", sevenDaysAgo.toISOString());

  // Initialize array for 7 days
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const metrics = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, 6 - i);
    return {
      day: days[date.getDay()],
      date: date,
      revenue: 0,
    };
  });

  // Aggregate revenue
  (orders || []).forEach(order => {
    if (!order.created_at || !order.total_price) return;
    const orderDate = startOfDay(new Date(order.created_at));
    const metricIndex = metrics.findIndex(m => m.date.getTime() === orderDate.getTime());
    if (metricIndex !== -1) {
      metrics[metricIndex].revenue += order.total_price;
    }
  });

  return metrics.map(m => ({ day: m.day, revenue: m.revenue }));
}

export async function getTopSellingProducts(limit = 5) {
  const supabase = createAdminClient();
  
  // Since complex GROUP BY requires RPC, we fetch order items from recent completed/paid orders.
  // To avoid fetching too much, we fetch all order items for completed/paid orders.
  // In a real large-scale app, an RPC or materialized view is better.
  
  const { data: validOrders } = await supabase
    .from("orders")
    .select("id")
    .in("status", ["completed", "paid"]);
    
  if (!validOrders || validOrders.length === 0) return [];
  
  const orderIds = validOrders.map(o => o.id);
  
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, quantity, price")
    .in("order_id", orderIds);
    
  if (!orderItems || orderItems.length === 0) return [];
  
  // Aggregate by product
  const productStats = orderItems.reduce((acc: Record<string, { quantity: number; revenue: number }>, item) => {
    if (!acc[item.product_id]) {
      acc[item.product_id] = { quantity: 0, revenue: 0 };
    }
    acc[item.product_id].quantity += item.quantity || 0;
    acc[item.product_id].revenue += (item.quantity || 0) * (item.price || 0);
    return acc;
  }, {});
  
  // Sort by quantity
  const topProductIds = Object.keys(productStats)
    .sort((a, b) => productStats[b].quantity - productStats[a].quantity)
    .slice(0, limit);
    
  if (topProductIds.length === 0) return [];
  
  // Fetch product details
  const { data: products } = await supabase
    .from("products")
    .select("id, name, thumbnail_url, stock")
    .in("id", topProductIds);
    
  if (!products) return [];
  
  // Combine stats and details
  const result = products.map(p => ({
    id: p.id,
    name: p.name,
    thumbnail_url: p.thumbnail_url,
    stock: p.stock,
    unitsSold: productStats[p.id].quantity,
    totalRevenue: productStats[p.id].revenue,
  }));
  
  // Maintain sort order
  return result.sort((a, b) => b.unitsSold - a.unitsSold);
}
