"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Price } from "@/components/settings/Price";
import { useAccountSettings } from "@/hooks/useAccountSettings";

interface OrdersListProps {
  initialOrders: any[];
  userEmail: string;
}

type OrderFilter = "all" | "paid" | "shipped" | "cancelled";
type SortMode = "latest" | "oldest";

const ORDER_COPY = {
  en: {
    title: "My Orders",
    archive: "ARCHIVE // TRANSACTION_LOGS_2026",
    filters: {
      all: "All",
      paid: "Paid",
      shipped: "Shipped",
      cancelled: "Cancelled",
    },
    sort: {
      latest: "Latest Transactions",
      oldest: "Oldest Records",
    },
    empty: "No Data Found in Archives",
    goToShop: "Go to Shop",
    serialId: "Serial ID",
    timestamp: "Timestamp",
    inventory: "Inventory",
    total: "Total Credit",
    item: "item",
    items: "items",
    statuses: {
      paid: "Confirmed",
      shipping: "In Transit",
      pending: "Wait for Payment",
      completed: "Delivered",
      cancelled: "Aborted",
    },
    verify: "Verify Details",
    pay: "Complete Payment",
  },
  vi: {
    title: "Đơn hàng của tôi",
    archive: "LƯU TRỮ // NHẬT KÝ GIAO DỊCH 2026",
    filters: {
      all: "Tất cả",
      paid: "Đã thanh toán",
      shipped: "Đang giao",
      cancelled: "Đã hủy",
    },
    sort: {
      latest: "Đơn mới nhất",
      oldest: "Đơn cũ nhất",
    },
    empty: "Chưa có đơn hàng nào",
    goToShop: "Mua sắm ngay",
    serialId: "Mã đơn",
    timestamp: "Ngày tạo",
    inventory: "Sản phẩm",
    total: "Tổng tiền",
    item: "sản phẩm",
    items: "sản phẩm",
    statuses: {
      paid: "Đã xác nhận",
      shipping: "Đang vận chuyển",
      pending: "Chờ thanh toán",
      completed: "Đã giao",
      cancelled: "Đã hủy",
    },
    verify: "Xem chi tiết",
    pay: "Thanh toán",
  },
};

const FILTERS: OrderFilter[] = ["all", "paid", "shipped", "cancelled"];

function getOrderStatusLabel(
  status: string,
  copy: (typeof ORDER_COPY)["en"],
) {
  if (status === "paid") return copy.statuses.paid;
  if (status === "shipping" || status === "shipped") return copy.statuses.shipping;
  if (status === "pending") return copy.statuses.pending;
  if (status === "completed") return copy.statuses.completed;
  if (status === "cancelled") return copy.statuses.cancelled;
  return status;
}

export function OrdersList({ initialOrders, userEmail }: OrdersListProps) {
  const { settings } = useAccountSettings();
  const copy = ORDER_COPY[settings.shopping.language];
  const dateLocale = settings.shopping.language === "vi" ? "vi-VN" : "en-US";
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("latest");

  const filteredOrders = useMemo(() => {
    const nextOrders = initialOrders.filter((order) => {
      if (filter === "all") return true;
      if (filter === "paid") return order.status === "paid";
      if (filter === "shipped") {
        return order.status === "shipping" || order.status === "shipped";
      }
      if (filter === "cancelled") return order.status === "cancelled";
      return true;
    });

    return [...nextOrders].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return sortMode === "latest" ? bTime - aTime : aTime - bTime;
    });
  }, [filter, initialOrders, sortMode]);

  return (
    <>
      <div className="mb-12">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-gradient mb-2 uppercase">
          {copy.title}
        </h1>
        <p className="text-outline font-label tracking-widest text-xs">
          {copy.archive}
          {" // "}
          {userEmail}
        </p>
      </div>

      <div className="glass-card rounded-xl p-6 mb-8 border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setFilter(filterKey)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                filter === filterKey
                  ? "bg-gradient-primary text-[#003732] shadow-[0_0_15px_rgba(111,247,232,0.3)]"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {copy.filters[filterKey]}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="w-full bg-white/5 border-b-2 border-[#6FF7E8]/20 text-white rounded-lg py-2 px-4 appearance-none focus:border-[#6FF7E8] focus:outline-none transition-colors outline-none cursor-pointer text-sm"
          >
            <option className="bg-[#0A1010]" value="latest">
              {copy.sort.latest}
            </option>
            <option className="bg-[#0A1010]" value="oldest">
              {copy.sort.oldest}
            </option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-[#6FF7E8]/40">
            unfold_more
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <div className="glass-card p-20 text-center border border-dashed border-white/10 rounded-3xl">
            <span className="material-symbols-outlined text-5xl text-white/20 mb-4 tracking-tighter">
              inventory_2
            </span>
            <p className="text-on-surface-variant font-headline uppercase tracking-widest text-sm opacity-50">
              {copy.empty}
            </p>
            <Link
              href="/shop"
              className="text-[#6FF7E8] text-xs font-bold uppercase mt-4 block underline underline-offset-4 hover:text-white transition-colors"
            >
              {copy.goToShop}
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const itemCount = order.order_items?.length || 0;
            const itemLabel = itemCount === 1 ? copy.item : copy.items;
            const statusLabel = getOrderStatusLabel(order.status, copy);

            return (
              <div
                key={order.id}
                className="glass-card group border border-white/5 hover:border-[#6FF7E8]/30 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-stretch">
                  <div
                    className={`p-6 flex-1 flex flex-col md:flex-row md:items-center gap-8 ${
                      order.status === "cancelled" ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">
                        {copy.serialId}
                      </div>
                      <div className="text-white font-bold font-headline text-sm">
                        #{String(order.id).slice(-8).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">
                        {copy.timestamp}
                      </div>
                      <div className="text-white/80 text-sm">
                        {new Date(order.created_at).toLocaleDateString(dateLocale)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">
                        {copy.inventory}
                      </div>
                      <div className="text-white/80 text-sm font-medium">
                        {itemCount} {itemLabel}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-white/30 font-label text-[9px] uppercase mb-1 tracking-widest">
                        {copy.total}
                      </div>
                      <Price
                        amount={order.total_price}
                        className="text-[#6FF7E8] font-black text-xl font-mono"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      {order.status === "paid" && (
                        <span className="px-3 py-1 rounded-full bg-[#6FF7E8]/10 text-[#6FF7E8] border border-[#6FF7E8]/20 text-[10px] font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(111,247,232,0.1)]">
                          {statusLabel}
                        </span>
                      )}
                      {(order.status === "shipping" || order.status === "shipped") && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-tighter">
                          {statusLabel}
                        </span>
                      )}
                      {order.status === "pending" && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-tighter animate-pulse">
                          {statusLabel}
                        </span>
                      )}
                      {order.status === "completed" && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-tighter">
                          {statusLabel}
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-tighter">
                          {statusLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/5 p-6 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:w-44 gap-2 border-l border-white/5">
                    <Link
                      href={`/success?orderId=${order.id}`}
                      className="w-full text-center py-2.5 px-6 rounded-xl border border-[#6FF7E8]/30 text-[#6FF7E8] hover:bg-[#6FF7E8] hover:text-[#003732] transition-all font-black text-[10px] uppercase tracking-widest block"
                    >
                      {copy.verify}
                    </Link>
                    {order.status === "pending" && order.payment_url && (
                      <a
                        href={order.payment_url}
                        className="w-full text-center py-2.5 px-6 rounded-xl bg-gradient-primary text-[#003732] hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        {copy.pay}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
