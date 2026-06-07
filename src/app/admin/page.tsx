import Image from "next/image";
import Link from "next/link";
import { getDashboardStats, getRecentOrders, getRevenueMetrics, getTopSellingProducts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, recentOrders, revenueMetrics, topSelling] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(4),
    getRevenueMetrics(),
    getTopSellingProducts(5),
  ]);

  const maxRevenue = Math.max(...revenueMetrics.map(m => m.revenue), 1); // Avoid division by zero

  return (
    <>
      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Revenue</p>
          <h3 className="text-2xl font-bold font-headline mb-2">{stats.totalRevenue.toLocaleString('vi-VN')}đ</h3>
          <div className="flex items-center gap-1 text-primary-container text-xs font-medium">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Realtime</span>
            <span className="text-on-surface-variant/40 ml-1">data</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Orders</p>
          <h3 className="text-2xl font-bold font-headline mb-2">{stats.totalOrders}</h3>
          <div className="flex items-center gap-1 text-primary-container text-xs font-medium">
            <span className="material-symbols-outlined text-sm">receipt_long</span>
            <span>All time</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Products</p>
          <h3 className="text-2xl font-bold font-headline mb-2">{stats.totalProducts}</h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-primary-container/20 text-primary-container uppercase tracking-tighter">Active Stock</span>
        </div>
        
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group border border-outline-variant/10">
          <p className="text-xs font-headline uppercase tracking-widest text-on-surface-variant mb-4">Pending</p>
          <h3 className="text-2xl font-bold font-headline mb-2">{stats.pendingOrders}</h3>
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
            {revenueMetrics.map((metric, idx) => {
              // Calculate height percentage (min 5% to show something, max 100%)
              const heightPercent = metric.revenue === 0 ? 5 : Math.max(10, (metric.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="w-full bg-surface-container-highest rounded-t-sm group relative">
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-primary-container/30 rounded-t-sm transition-all group-hover:bg-primary-container/50"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright px-2 py-1 rounded text-[10px] text-on-surface shadow-lg z-10 whitespace-nowrap">
                    {metric.revenue.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-headline px-2">
            {revenueMetrics.map((m, idx) => <span key={idx}>{m.day}</span>)}
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-on-surface-variant italic">No recent orders</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-surface-bright/20 transition-colors">
                      <td className="py-4 font-headline text-on-surface/90">#{order.id.toString().slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 font-medium">{order.customer_name || 'Unknown User'}</td>
                      <td className="py-4 text-on-surface/70">{(order.total_price || 0).toLocaleString('vi-VN')}đ</td>
                      <td className="py-4 text-right">
                        {order.status === 'shipped' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container/10 text-primary-container border border-primary-container/20 uppercase">SHIPPED</span>}
                        {order.status === 'pending' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">PENDING</span>}
                        {order.status === 'processing' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#6FF7E8]/10 text-[#6FF7E8] border border-[#6FF7E8]/20 uppercase">PROCESSING</span>}
                        {order.status === 'completed' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">COMPLETED</span>}
                        {order.status === 'cancelled' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container border border-error-container/20 uppercase">CANCELLED</span>}
                        {order.status === 'paid' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">PAID</span>}
                      </td>
                    </tr>
                  ))
                )}
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
              {topSelling.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-on-surface-variant italic">Not enough data to determine top selling products.</td>
                </tr>
              ) : (
                topSelling.map((product, index) => {
                  // Assuming an arbitrary total inventory baseline to show a percentage, e.g. stock + unitsSold
                  const totalInventoryBaseline = product.stock + product.unitsSold;
                  const inventoryPercent = totalInventoryBaseline > 0 ? Math.round((product.stock / totalInventoryBaseline) * 100) : 0;
                  
                  return (
                    <tr key={product.id} className="group hover:bg-surface-bright/20 transition-colors">
                      <td className="py-6 font-headline text-xl text-primary-container/40">{String(index + 1).padStart(2, '0')}</td>
                      <td className="py-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                          {product.thumbnail_url ? (
                            <Image src={product.thumbnail_url} alt={product.name} width={48} height={48} className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant/50 material-symbols-outlined">image</div>
                          )}
                        </div>
                        <div>
                          <span className="block font-bold text-on-surface truncate max-w-[200px] sm:max-w-[300px]">{product.name}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate max-w-[200px] block">Product ID: {product.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="py-6 font-headline">{product.unitsSold.toLocaleString()}</td>
                      <td className="py-6 font-bold">{product.totalRevenue.toLocaleString('vi-VN')}đ</td>
                      <td className="py-6 text-right">
                        <div className="w-32 h-1.5 bg-surface-container-highest rounded-full overflow-hidden inline-block align-middle ml-4">
                          <div className="bg-primary-container h-full transition-all" style={{ width: `${inventoryPercent}%` }}></div>
                        </div>
                        <span className="text-[10px] ml-2 text-on-surface-variant font-headline w-8 inline-block text-left">{inventoryPercent}%</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
