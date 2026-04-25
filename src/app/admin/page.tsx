import Image from "next/image";
import Link from "next/link";
import { orders } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const recentOrders = orders.slice(0, 4);

  return (
    <>
      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Revenue</p>
          <h3 className="text-2xl font-bold font-headline mb-2">19.890.000đ</h3>
          <div className="flex items-center gap-1 text-primary-container text-xs font-medium">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12.5%</span>
            <span className="text-on-surface-variant/40 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Orders</p>
          <h3 className="text-2xl font-bold font-headline mb-2">5</h3>
          <div className="flex items-center gap-1 text-primary-container text-xs font-medium">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+8.3%</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Products</p>
          <h3 className="text-2xl font-bold font-headline mb-2">8</h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-primary-container/20 text-primary-container uppercase tracking-tighter">Active Stock</span>
        </div>
        
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Pending</p>
          <h3 className="text-2xl font-bold font-headline mb-2">1</h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase tracking-tighter">Requires Action</span>
        </div>
      </div>

      {/* Row 2: Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 glass-card rounded-xl p-8 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-headline font-bold text-lg">Revenue Metrics</h4>
            <span className="material-symbols-outlined text-on-surface-variant/40">more_vert</span>
          </div>
          <div className="flex items-end justify-between h-48 gap-3 px-2">
            <div className="w-full bg-surface-container-highest rounded-t-sm group relative">
              <div className="absolute bottom-0 left-0 w-full bg-primary-container/30 h-[40%] rounded-t-sm transition-all group-hover:bg-primary-container/50"></div>
              <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright px-2 py-1 rounded text-[10px] text-on-surface shadow-lg z-10">2.4M</div>
            </div>
            <div className="w-full bg-surface-container-highest rounded-t-sm group relative">
              <div className="absolute bottom-0 left-0 w-full bg-primary-container/30 h-[65%] rounded-t-sm transition-all group-hover:bg-primary-container/50"></div>
            </div>
            <div className="w-full bg-surface-container-highest rounded-t-sm group relative">
              <div className="absolute bottom-0 left-0 w-full bg-primary-container h-[85%] rounded-t-sm transition-all group-hover:bg-primary-container/80 shadow-[0_-4px_12px_rgba(111,247,232,0.2)]"></div>
            </div>
            <div className="w-full bg-surface-container-highest rounded-t-sm group relative">
              <div className="absolute bottom-0 left-0 w-full bg-primary-container/30 h-[55%] rounded-t-sm transition-all group-hover:bg-primary-container/50"></div>
            </div>
            <div className="w-full bg-surface-container-highest rounded-t-sm group relative">
              <div className="absolute bottom-0 left-0 w-full bg-primary-container/30 h-[30%] rounded-t-sm transition-all group-hover:bg-primary-container/50"></div>
            </div>
            <div className="w-full bg-surface-container-highest rounded-t-sm group relative">
              <div className="absolute bottom-0 left-0 w-full bg-primary-container/30 h-[75%] rounded-t-sm transition-all group-hover:bg-primary-container/50"></div>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-headline px-2">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
        </div>
        
        <div className="lg:col-span-2 glass-card rounded-xl p-8 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-headline font-bold text-lg">Recent Orders</h4>
            <Link href="/admin/orders" className="text-[10px] font-bold text-primary-container hover:underline transition-all uppercase tracking-widest">
              View Archives
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-on-surface-variant/50 text-[11px] uppercase tracking-widest border-b border-outline-variant/10">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-surface-bright/20 transition-colors">
                    <td className="py-4 font-headline text-on-surface/90">#{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="py-4 font-medium">{order.shipping_address ? (order.shipping_address as any).name : 'Unknown User'}</td>
                    <td className="py-4 text-on-surface/70">{order.total_amount.toLocaleString('vi-VN')}đ</td>
                    <td className="py-4 text-right">
                      {order.status === 'shipped' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container/10 text-primary-container border border-primary-container/20 uppercase">SHIPPED</span>}
                      {order.status === 'pending' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">PENDING</span>}
                      {order.status === 'paid' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">PAID</span>}
                      {order.status === 'cancelled' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container border border-error-container/20 uppercase">CANCELLED</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Top Selling */}
      <div className="glass-card rounded-xl p-8 mb-12 border border-outline-variant/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="font-headline font-bold text-lg">Top Selling Products</h4>
            <p className="text-[11px] text-on-surface-variant/60 uppercase tracking-widest mt-1">Current Quarter Analysis</p>
          </div>
          <button className="bg-gradient-primary text-on-primary font-bold px-6 py-2 rounded-xl text-xs hover:opacity-90 transition-opacity">EXPORT PDF</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-on-surface-variant/50 text-[11px] uppercase tracking-widest border-b border-outline-variant/10">
                <th className="pb-4 font-medium">Rank</th>
                <th className="pb-4 font-medium">Product Identity</th>
                <th className="pb-4 font-medium">Units Sold</th>
                <th className="pb-4 font-medium">Total Revenue</th>
                <th className="pb-4 font-medium text-right">Inventory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              <tr className="group hover:bg-surface-bright/20 transition-colors">
                <td className="py-6 font-headline text-xl text-primary-container/40">01</td>
                <td className="py-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfnuMrhlgFSE9LS-rAroY6q7rBXkTrfe9UirKbqHvvy-nDv8p9YM8CiwJf8XRYxUpXKWnEP-fugpcyjlnsNKSBmVZMITG6MDMAGH5QGoXpxgbuALbAB7Wa45TBFwXdyVp1dBffGrfcODAV095eqV_rRuUc5ZdRkJRjE6k58xdpou7o8ZbKNa3xNe_efUtIw7Gr8hXWIikbeJrx2HPdFXQPElgEVWt_bXfnZY-G06TH4_eOgVPoVf-7AJnNPvJJMR_OMQ5EDy7X7h8" alt="Cyber Rex Model" width={48} height={48} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div>
                    <span className="block font-bold text-on-surface">Cyber Rex X-1</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Model Series A</span>
                  </div>
                </td>
                <td className="py-6 font-headline">1,420</td>
                <td className="py-6 font-bold">5.680.000đ</td>
                <td className="py-6 text-right">
                  <div className="w-32 h-1.5 bg-surface-container-highest rounded-full overflow-hidden inline-block align-middle ml-4">
                    <div className="bg-primary-container h-full w-[85%]"></div>
                  </div>
                  <span className="text-[10px] ml-2 text-on-surface-variant font-headline w-6 inline-block text-left">85%</span>
                </td>
              </tr>
              <tr className="group hover:bg-surface-bright/20 transition-colors">
                <td className="py-6 font-headline text-xl text-primary-container/40">02</td>
                <td className="py-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuADDPKje3HlvR1SxDfmAJjKY7mZ3SyODXfN4U22mAIhaGLqVWg-ImBxXdX8TvEk3Oqn1vZQyvPUXiHMyUpsWVXJmJrmkn47gnUnMy8DFJop64RIfCmLwv9ufTvdHVkn7KqBbC3aXxF4sfqs8LDEehmUGtQ_2vUHGzOdheA1AAuA7u6nvfhq8jQjv8WsgkzD2bFVucBT7132XmbVOdOXZQuq12ZhS7SYJgiprjq86NmtDhsLAJhXOrF-Mm-RMliogH7CzU7S9pK_iZs" alt="Aero Glide Drone" width={48} height={48} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div>
                    <span className="block font-bold text-on-surface">Aero Glide v3</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Drone Tech</span>
                  </div>
                </td>
                <td className="py-6 font-headline">940</td>
                <td className="py-6 font-bold">3.290.000đ</td>
                <td className="py-6 text-right">
                  <div className="w-32 h-1.5 bg-surface-container-highest rounded-full overflow-hidden inline-block align-middle ml-4">
                    <div className="bg-primary-container h-full w-[42%]"></div>
                  </div>
                  <span className="text-[10px] ml-2 text-on-surface-variant font-headline w-6 inline-block text-left">42%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
