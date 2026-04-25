"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address?: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);
    const result = await updateOrderStatus(order.id, status);
    if (result.success) {
      alert("Cập nhật trạng thái thành công!");
    } else {
      alert("Lỗi: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06151a]/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-2xl rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-[#0e1e23]">
          <div>
            <h3 className="text-xl font-bold text-[#EAFAF8] font-brand tracking-tight">Order #{typeof order.id === 'string' ? order.id.slice(0, 8).toUpperCase() : order.id}</h3>
            <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">Protocol: {order.payment_method?.toUpperCase() || 'UNKNOWN'}</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-surface-container-high text-xs text-[#6FF7E8] border border-[#6FF7E8]/20 rounded-lg px-3 py-1.5 focus:ring-0 outline-none appearance-none cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar bg-[#06151a]">
          {/* Customer Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6FF7E8] mb-3">Customer Identity</h4>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">{order.customer_name || "Khách vãng lai"}</p>
                <p className="text-xs text-on-surface-variant">{order.customer_phone || "N/A"}</p>
                <p className="text-xs text-on-surface-variant">{order.customer_email || "N/A"}</p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6FF7E8] mb-3">Terminal Destination</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {order.address || "Chưa cung cấp địa chỉ"}
              </p>
            </div>
          </div>

          {/* Note: In a real app, you would fetch order items here. For now, we'll show a placeholder or mock */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6FF7E8] mb-4">Neural Assets</h4>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
              <div className="p-4 text-center text-xs text-on-surface-variant italic">
                Chi tiết sản phẩm sẽ được hiển thị tại đây.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end border-t border-white/5 pt-6">
            <div className="w-48 space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Subtotal:</span>
                <span>{order.total_price.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Tax & Fee:</span>
                <span>0đ</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#6FF7E8] pt-2 border-t border-white/10">
                <span>Total Value:</span>
                <span>{order.total_price.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-[#0e1e23] border-t border-white/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-on-surface-variant hover:text-white transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleUpdateStatus}
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-[#06151a] bg-gradient-to-br from-[#6ff7e8] to-[#1f7ea1] rounded-lg shadow-[0px_0px_20px_rgba(111,247,232,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
