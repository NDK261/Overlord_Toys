"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function OrdersContent() {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function getOrders() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login?callbackUrl=/account/orders");
          return;
        }

        setUser(session.user);

        // Lấy danh sách đơn hàng kèm số lượng sản phẩm (count)
        // Lưu ý: Supabase count query trong select có thể hơi khác tùy version, 
        // ở đây ta lấy toàn bộ items để đếm cho chắc chắn hoặc dùng rpc
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(id)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    getOrders();
  }, [router]);

  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;
    if (filter === "Paid") return order.status === "paid";
    if (filter === "Shipped") return order.status === "shipping" || order.status === "shipped";
    if (filter === "Cancelled") return order.status === "cancelled";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#6FF7E8]/20 border-t-[#6FF7E8] rounded-full animate-spin mb-4"></div>
        <p className="text-outline font-label text-[10px] uppercase tracking-widest animate-pulse">Syncing Transaction Logs...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-gradient mb-2 uppercase">My Orders</h1>
        <p className="text-outline font-label tracking-widest text-xs">ARCHIVE // TRANSACTION_LOGS_2026 // {user?.email}</p>
      </div>

      {/* Filters Shell */}
      <div className="glass-card rounded-xl p-6 mb-8 border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3">
          {['All', 'Paid', 'Shipped', 'Cancelled'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                filter === f 
                  ? "bg-gradient-primary text-[#003732] shadow-[0_0_15px_rgba(111,247,232,0.3)]" 
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <select className="w-full bg-white/5 border-b-2 border-[#6FF7E8]/20 text-white rounded-lg py-2 px-4 appearance-none focus:border-[#6FF7E8] focus:outline-none transition-colors outline-none cursor-pointer text-sm">
            <option className="bg-[#0A1010]">Latest Transactions</option>
            <option className="bg-[#0A1010]">Oldest Records</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-[#6FF7E8]/40">unfold_more</span>
        </div>
      </div>

      {/* Order History List */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <div className="glass-card p-20 text-center border border-dashed border-white/10 rounded-3xl">
            <span className="material-symbols-outlined text-5xl text-white/20 mb-4 tracking-tighter">inventory_2</span>
            <p className="text-on-surface-variant font-headline uppercase tracking-widest text-sm opacity-50">No Data Found in Archives</p>
            <Link href="/shop" className="text-[#6FF7E8] text-xs font-bold uppercase mt-4 block underline underline-offset-4 hover:text-white transition-colors">Go to Shop</Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="glass-card group border border-white/5 hover:border-[#6FF7E8]/30 rounded-2xl overflow-hidden transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-stretch">
                <div className={`p-6 flex-1 flex flex-col md:flex-row md:items-center gap-8 ${order.status === 'cancelled' ? 'opacity-40' : ''}`}>
                  <div className="flex-shrink-0">
                    <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">Serial ID</div>
                    <div className="text-white font-bold font-headline text-sm">#{order.id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">Timestamp</div>
                    <div className="text-white/80 text-sm">{new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">Inventory</div>
                    <div className="text-white/80 text-sm font-medium">{order.order_items?.length || 0} item(s)</div>
                  </div>
                  <div className="flex-grow">
                    <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">Total Credit</div>
                    <div className="text-[#6FF7E8] font-black text-xl font-mono">{order.total_price.toLocaleString("vi-VN")}đ</div>
                  </div>
                  <div className="flex-shrink-0">
                    {order.status === 'paid' && <span className="px-3 py-1 rounded-full bg-[#6FF7E8]/10 text-[#6FF7E8] border border-[#6FF7E8]/20 text-[10px] font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(111,247,232,0.1)]">Confirmed</span>}
                    {(order.status === 'shipping' || order.status === 'shipped') && <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-tighter">In Transit</span>}
                    {order.status === 'pending' && <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-tighter animate-pulse">Wait for Payment</span>}
                    {order.status === 'completed' && <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter">Delivered</span>}
                    {order.status === 'cancelled' && <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-tighter">Aborted</span>}
                  </div>
                </div>
                <div className="bg-white/5 p-6 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:w-44 gap-2 border-l border-white/5">
                  <Link href={`/success?orderId=${order.id}`} className="w-full text-center py-2.5 px-6 rounded-xl border border-[#6FF7E8]/30 text-[#6FF7E8] hover:bg-[#6FF7E8] hover:text-[#003732] transition-all font-black text-[10px] uppercase tracking-widest block">
                    Verify Details
                  </Link>
                  {order.status === 'pending' && order.payment_url && (
                    <a href={order.payment_url} className="w-full text-center py-2.5 px-6 rounded-xl bg-gradient-primary text-[#003732] hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest">
                      Complete Payment
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#6FF7E8]/20 border-t-[#6FF7E8] rounded-full animate-spin mb-4"></div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
