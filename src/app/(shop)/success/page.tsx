"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Price } from "@/components/settings/Price";
import { useAccountSettings } from "@/hooks/useAccountSettings";

const SUCCESS_COPY = {
  en: {
    loading: "Decrypting Success Signal...",
    missingTitle: "Signal Lost",
    missingDesc: "This order could not be found in the system.",
    backToShop: "Back to Shop",
    confirmed: "Order Confirmed!",
    trackingCode: "Tracking code:",
    shippingInfo: "Shipping Information",
    receiver: "Receiver",
    phone: "Phone Number",
    address: "Shipping Address",
    payment: "Payment",
    method: "Method",
    payos: "Bank transfer (PayOS)",
    cod: "Cash on delivery (COD)",
    status: "Status",
    confirmedStatus: "Confirmed by system",
    orderDetails: "Order Details",
    subtotal: "Subtotal",
    shippingFee: "Shipping Fee",
    free: "Free",
    discount: "Discount",
    total: "Total Amount",
    continueShopping: "Continue Shopping",
    trackOrder: "Track Order",
  },
  vi: {
    loading: "Đang tải thông tin đơn hàng...",
    missingTitle: "Không tìm thấy đơn hàng",
    missingDesc: "Không tìm thấy thông tin đơn hàng này trong hệ thống.",
    backToShop: "Quay lại cửa hàng",
    confirmed: "Đặt hàng thành công!",
    trackingCode: "Mã vận đơn:",
    shippingInfo: "Thông tin nhận hàng",
    receiver: "Người nhận",
    phone: "Số điện thoại",
    address: "Địa chỉ giao hàng",
    payment: "Thanh toán",
    method: "Phương thức",
    payos: "Chuyển khoản (PayOS)",
    cod: "Thanh toán khi nhận hàng (COD)",
    status: "Trạng thái",
    confirmedStatus: "Đã xác nhận trong hệ thống",
    orderDetails: "Chi tiết đơn hàng",
    subtotal: "Tiền hàng",
    shippingFee: "Phí vận chuyển",
    free: "Miễn phí",
    discount: "Giảm giá",
    total: "Tổng thanh toán",
    continueShopping: "Tiếp tục mua hàng",
    trackOrder: "Theo dõi đơn hàng",
  },
};

function SuccessContent() {
  const { clearCart } = useCart();
  const { settings } = useAccountSettings();
  const copy = SUCCESS_COPY[settings.shopping.language];
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // 1. Lấy thông tin đơn hàng
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Clear cart now that order is confirmed
        clearCart();

        // 2. Lấy danh sách sản phẩm trong đơn
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*, products(*)")
          .eq("order_id", orderId);

        if (itemsError) throw itemsError;
        setItems(itemsData || []);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051010]">
        <div className="w-16 h-16 border-4 border-[#6FF7E8]/20 border-t-[#6FF7E8] rounded-full animate-spin mb-4"></div>
        <p className="font-headline text-[#6FF7E8] text-xs tracking-widest uppercase animate-pulse">{copy.loading}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051010] p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4 opacity-50">error</span>
        <h1 className="font-headline text-2xl text-white uppercase mb-2">{copy.missingTitle}</h1>
        <p className="text-on-surface-variant mb-8">{copy.missingDesc}</p>
        <Link href="/shop" className="btn-primary px-8">{copy.backToShop}</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="glass-card p-1 pb-8 rounded-3xl border border-[#6FF7E8]/20 bg-gradient-to-br from-[#0A1010] to-[#051515] shadow-[0_0_80px_rgba(111,247,232,0.15)] relative overflow-hidden">
        {/* Header Section */}
        <div className="p-8 text-center border-b border-white/5">
          <div className="mb-6 relative inline-block">
            <div className="w-20 h-20 rounded-full border-2 border-[#6FF7E8] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(111,247,232,0.4)] bg-[#6FF7E8]/10">
              <span className="material-symbols-outlined text-4xl text-[#6FF7E8]">check_circle</span>
            </div>
          </div>
          <h1 className="font-headline text-3xl font-black text-[#EAFAF8] uppercase tracking-tighter mb-2 lg:text-4xl">{copy.confirmed}</h1>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] opacity-70">{copy.trackingCode} <span className="text-[#6FF7E8] font-mono">#{order.id.slice(-8).toUpperCase()}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {/* Customer Info */}
          <div className="p-8 bg-[#0A1010]">
            <h3 className="text-[#6FF7E8] font-headline text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">person</span> {copy.shippingInfo}
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">{copy.receiver}</p>
                <p className="text-white font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">{copy.phone}</p>
                <p className="text-white font-medium">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">{copy.address}</p>
                <p className="text-white font-medium leading-relaxed">{order.customer_address}</p>
              </div>
            </div>
          </div>

          {/* Payment & Status */}
          <div className="p-8 bg-[#0A1010]">
            <h3 className="text-[#6FF7E8] font-headline text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">payments</span> {copy.payment}
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">{copy.method}</p>
                <p className="text-white font-medium uppercase tracking-wider">{order.payment_method === 'payos' ? copy.payos : copy.cod}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">{copy.status}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#6FF7E8] animate-pulse shadow-[0_0_10px_#6FF7E8]"></span>
                  <span className="text-[#6FF7E8] font-black uppercase tracking-tighter text-xs">{copy.confirmedStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-8">
          <h3 className="text-[#6FF7E8] font-headline text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">shopping_bag</span> {copy.orderDetails}
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5 transition-hover hover:border-[#6FF7E8]/20">
                <div className="w-20 h-20 rounded-xl bg-white/5 relative overflow-hidden flex-shrink-0 border border-white/10">
                  {item.products?.thumbnail_url && (
                    <Image src={item.products.thumbnail_url} alt={item.products.name} fill className="object-contain p-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-base md:text-lg font-bold truncate mb-1">{item.products?.name}</h4>
                  <p className="text-on-surface-variant text-sm opacity-80 font-medium">
                    {item.quantity} x <Price amount={item.price} />
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#6FF7E8] font-black font-mono text-base md:text-lg">
                    <Price amount={item.quantity * item.price} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="p-8 bg-white/5 border-t border-b border-white/5">
          <div className="max-w-sm ml-auto space-y-3">
            <div className="flex justify-between text-xs text-on-surface-variant/70 uppercase font-black tracking-widest">
              <span>{copy.subtotal}</span>
              <Price amount={order.total_price - order.shipping_fee + order.discount_amount} className="text-white" />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant/70 uppercase font-black tracking-widest">
              <span>{copy.shippingFee}</span>
              <span className="text-white">{order.shipping_fee === 0 ? copy.free : <Price amount={order.shipping_fee} />}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-xs text-[#6FF7E8] uppercase font-black tracking-widest">
                <span>{copy.discount}</span>
                <Price amount={order.discount_amount} negative />
              </div>
            )}
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="text-[10px] text-[#6FF7E8] uppercase font-black tracking-[0.3em]">{copy.total}</span>
              <span className="text-3xl text-white font-black font-mono leading-none tracking-tighter">
                <Price amount={order.total_price} />
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary py-4 px-10 rounded-2xl text-sm font-headline font-black uppercase tracking-[0.2em]">
              {copy.continueShopping}
            </Link>
            <Link href="/account/orders" className="bg-white/5 hover:bg-white/10 text-white py-4 px-10 rounded-2xl text-sm font-headline font-black uppercase tracking-[0.2em] border border-white/10 transition-all">
              {copy.trackOrder}
            </Link>
          </div>
          <p className="text-[9px] text-on-surface-variant/30 uppercase font-black tracking-[0.4em] mt-10">Overlord Toys Global Relay Service</p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#051010]">
        <div className="w-16 h-16 border-4 border-[#6FF7E8]/20 border-t-[#6FF7E8] rounded-full animate-spin mb-4"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
