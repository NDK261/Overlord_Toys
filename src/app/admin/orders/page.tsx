"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import OrderDetailModal from "./OrderDetailModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#6FF7E8]/20 border-t-[#6FF7E8] rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
      <p className="font-bold uppercase tracking-widest text-xs mb-2">Error Fetching Orders</p>
      <p className="text-sm">{error}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#6FF7E8]/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6FF7E8] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#6FF7E8] uppercase tracking-[0.4em]">Neural Archive / Orders</span>
          </div>
          <h1 className="text-5xl font-black text-white font-headline tracking-tighter uppercase leading-none">
            Transactions <span className="text-stroke-cyan opacity-50">Log</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-3 max-w-xl font-medium leading-relaxed">
            Monitor incoming data streams. Validate payments and manage the distribution of physical artifacts to collectors.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select className="bg-white/5 text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:ring-1 ring-[#6FF7E8]/50 outline-none transition-all">
            <option className="bg-[#06151a]">All Status</option>
            <option className="bg-[#06151a]">Pending</option>
            <option className="bg-[#06151a]">Processing</option>
            <option className="bg-[#06151a]">Completed</option>
            <option className="bg-[#06151a]">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden bg-[#0A1010]/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Order ID</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Customer</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Valuation</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Protocol</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Neural Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm italic">
                    No transaction logs detected in this sector.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-[#6FF7E8]/5 transition-all">
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-[#6FF7E8] font-mono uppercase tracking-tighter">
                        #{typeof order.id === 'string' ? order.id.slice(0, 8).toUpperCase() : order.id}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white uppercase tracking-tight">{order.customer_name || "Unknown Collector"}</p>
                      <p className="text-[10px] text-on-surface-variant/60 font-mono">{order.customer_phone || "N/A"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white font-mono">
                        {(order.total_price || 0).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                        {order.payment_method?.toUpperCase() || 'COD'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          order.status === 'processing' || order.status === 'completed' ? 'bg-[#6FF7E8]' : 
                          order.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${
                           order.status === 'processing' || order.status === 'completed' ? 'text-[#6FF7E8]' : 
                           order.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {order.status === 'processing' ? 'Processing' : 
                           order.status === 'pending' ? 'Pending' : 
                           order.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#6FF7E8] hover:shadow-[0_0_15px_rgba(111,247,232,0.3)] px-4 py-1.5 rounded-lg border border-[#6FF7E8]/20 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#6FF7E8] hover:text-[#003732]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
