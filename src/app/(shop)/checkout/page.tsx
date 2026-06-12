"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { Price } from "@/components/settings/Price";

const CHECKOUT_COPY = {
  en: {
    loading: "Initializing Secure Protocol...",
    emptyTitle: "No Artifacts Detected",
    emptyDesc: "Your acquisition queue is currently empty.",
    scanShop: "Scan Shop",
    eyebrow: "Security Level: Class A",
    title: "Finalize Acquisition",
    shippingTitle: "Deployment Coords",
    nameLabel: "Identity Tag",
    namePlaceholder: "Full Name",
    phoneLabel: "Comms Freq",
    phonePlaceholder: "Phone Number",
    emailLabel: "Encrypted Mail",
    emailPlaceholder: "Email Address",
    addressLabel: "Drop Zone",
    addressPlaceholder: "Physical Delivery Address",
    paymentTitle: "Credit Protocol",
    payosTitle: "PayOS Gateway",
    payosDesc: "Instant clearance",
    secureBadge: "Secure",
    codTitle: "Delivery Settlement (COD)",
    codDesc: "Pay at drop zone",
    orderEmailsStart: "Order update emails are",
    enabled: "enabled",
    disabled: "disabled",
    processing: "Processing...",
    confirm: "Confirm Transmission",
    manifest: "Manifest",
    units: "Units",
    qty: "Qty:",
    subtotal: "Subtotal",
    deliveryCharge: "Delivery Charge",
    free: "FREE",
    rewards: "Rewards Applied",
    total: "Total Valuation",
    securePay: "Secure Neural-Pay Protocol Active",
    createError: "There was an error while creating the order.",
    systemError:
      "System error (500). Please check payment configuration or try again later.",
  },
  vi: {
    loading: "Đang chuẩn bị trang thanh toán...",
    emptyTitle: "Chưa có sản phẩm",
    emptyDesc: "Giỏ hàng của bạn đang trống.",
    scanShop: "Quay lại giỏ hàng",
    eyebrow: "Mức bảo mật: loại A",
    title: "Xác nhận đơn hàng",
    shippingTitle: "Thông tin giao hàng",
    nameLabel: "Người nhận",
    namePlaceholder: "Họ và tên",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "Số điện thoại",
    emailLabel: "Email",
    emailPlaceholder: "Địa chỉ email",
    addressLabel: "Địa chỉ nhận hàng",
    addressPlaceholder: "Nhập địa chỉ giao hàng",
    paymentTitle: "Phương thức thanh toán",
    payosTitle: "Cổng PayOS",
    payosDesc: "Thanh toán online và xác nhận nhanh",
    secureBadge: "An toàn",
    codTitle: "Thanh toán khi nhận hàng (COD)",
    codDesc: "Trả tiền khi đơn hàng được giao",
    orderEmailsStart: "Email cập nhật đơn hàng đang",
    enabled: "bật",
    disabled: "tắt",
    processing: "Đang xử lý...",
    confirm: "Xác nhận đặt hàng",
    manifest: "Đơn hàng",
    units: "sản phẩm",
    qty: "SL:",
    subtotal: "Tạm tính",
    deliveryCharge: "Phí vận chuyển",
    free: "Miễn phí",
    rewards: "Ưu đãi đã áp dụng",
    total: "Tổng thanh toán",
    securePay: "Thanh toán được bảo vệ",
    createError: "Có lỗi xảy ra khi tạo đơn hàng.",
    systemError:
      "Lỗi hệ thống (500). Vui lòng kiểm tra cấu hình thanh toán hoặc thử lại sau.",
  },
};

export default function CheckoutPage() {
  const { 
    items, subtotal, shippingFee, shippingDiscount, orderDiscount, 
    totalPrice, appliedVouchers, clearCart, isLoaded: cartLoaded 
  } = useCart();
  const { user, profile, loading: userLoading } = useUser();
  const { settings, loading: settingsLoading } = useAccountSettings();
  const copy = CHECKOUT_COPY[settings.shopping.language];
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentTouched, setPaymentTouched] = useState(false);

  useEffect(() => {
    if (cartLoaded && items.length === 0) {
      router.push("/cart");
    }
  }, [cartLoaded, items, router]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "payos"
  });

  useEffect(() => {
    if (settingsLoading || paymentTouched) return;

    setFormData((prev) => ({
      ...prev,
      paymentMethod: settings.shopping.defaultPaymentMethod,
    }));
  }, [paymentTouched, settings.shopping.defaultPaymentMethod, settingsLoading]);

  // Tự động điền dữ liệu khi user hoặc profile sẵn sàng
  useEffect(() => {
    if (!userLoading && (user || profile)) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || profile?.full_name || user?.user_metadata?.full_name || "",
        email: prev.email || user?.email || "",
        phone: prev.phone || profile?.phone || "",
        address: prev.address || profile?.address || "",
      }));
    }
  }, [user, profile, userLoading]);

  const isLoaded = cartLoaded && !userLoading && !settingsLoading;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedPhone = formData.phone?.trim();
    const isValidPhone = /^0\d{9}$/.test(trimmedPhone);
    if (!isValidPhone) {
      alert(settings.shopping.language === "vi" 
        ? "Số điện thoại không hợp lệ. Chỉ được nhập số, phải bắt đầu bằng số 0 và có đúng 10 chữ số." 
        : "Invalid phone number. Must contain only digits, start with 0, and have exactly 10 digits."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          customerInfo: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
          },
          paymentMethod: formData.paymentMethod,
          vouchers: appliedVouchers,
          notificationSettings: settings.notifications,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || copy.createError);
        }
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          router.push(`/success?orderId=${result.orderId}`);
        }
      } else {
        // Xử lý lỗi không phải JSON (VD: 500 HTML)
        const textError = await response.text();
        console.error("Server Error Response:", textError);
        throw new Error(copy.systemError);
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <p className="font-headline text-on-surface-variant text-xs tracking-widest uppercase animate-pulse">{copy.loading}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl border-white/10 p-8 text-center max-w-md w-full">
          <p className="font-headline text-2xl font-bold mb-3 text-[#EAFAF8]">{copy.emptyTitle}</p>
          <p className="text-on-surface-variant mb-6 text-sm">{copy.emptyDesc}</p>
          <Link href="/cart" className="inline-block bg-gradient-primary text-[#003732] font-headline font-bold px-8 py-3 rounded-xl uppercase tracking-widest">
            {copy.scanShop}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Editorial Header */}
      <div className="mb-12">
        <span className="font-label text-xs tracking-widest text-[#6FF7E8] uppercase opacity-80 font-black">{copy.eyebrow}</span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter mt-2 text-[#EAFAF8] uppercase lg:text-6xl">{copy.title}</h1>
      </div>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* Left Column: 60% */}
        <div className="lg:col-span-6 space-y-8">
          {/* Shipping Info */}
          <section className="glass-card p-8 bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#6FF7E8]">local_shipping</span>
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#EAFAF8] uppercase">{copy.shippingTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">{copy.nameLabel}</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm text-[#EAFAF8]" placeholder={copy.namePlaceholder} type="text"/>
              </div>
              <div className="space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">{copy.phoneLabel}</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm text-[#EAFAF8]" placeholder={copy.phonePlaceholder} type="tel"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">{copy.emailLabel}</label>
                <input required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm text-[#EAFAF8]" placeholder={copy.emailPlaceholder} type="email"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">{copy.addressLabel}</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm resize-none text-[#EAFAF8]" placeholder={copy.addressPlaceholder} rows={3}></textarea>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="glass-card p-8 bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#6FF7E8]">account_balance_wallet</span>
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#EAFAF8] uppercase">{copy.paymentTitle}</h2>
            </div>
            <div className="space-y-4">
              <label 
                onClick={() => {
                  setPaymentTouched(true);
                  setFormData(p => ({...p, paymentMethod: "payos"}));
                }}
                className={`relative flex items-center p-5 cursor-pointer rounded-xl glass-card transition-all border-l-4 ${formData.paymentMethod === "payos" ? "border-l-[#6FF7E8] bg-[#6FF7E8]/10 shadow-[0_0_25px_rgba(111,247,232,0.2)]" : "border-white/5 hover:bg-white/5"}`}
              >
                <div className="flex-1 flex items-center gap-4">
                  <span className={`material-symbols-outlined text-3xl ${formData.paymentMethod === "payos" ? "text-[#6FF7E8]" : "text-white/40"}`}>payments</span>
                  <div>
                    <p className={`font-headline font-bold text-sm ${formData.paymentMethod === "payos" ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>{copy.payosTitle}</p>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-black">{copy.payosDesc}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-tighter uppercase ${formData.paymentMethod === "payos" ? "bg-[#6FF7E8] text-[#003732] shadow-[0_0_10px_#6FF7E8]" : "bg-white/10 text-white/40"}`}>{copy.secureBadge}</span>
              </label>

              <label 
                onClick={() => {
                  setPaymentTouched(true);
                  setFormData(p => ({...p, paymentMethod: "cod"}));
                }}
                className={`relative flex items-center p-5 cursor-pointer rounded-xl glass-card transition-all border-l-4 ${formData.paymentMethod === "cod" ? "border-l-[#6FF7E8] bg-[#6FF7E8]/10 shadow-[0_0_25px_rgba(111,247,232,0.2)]" : "border-white/5 hover:bg-white/5"}`}
              >
                <div className="flex-1 flex items-center gap-4">
                  <span className={`material-symbols-outlined text-3xl ${formData.paymentMethod === "cod" ? "text-[#6FF7E8]" : "text-white/40"}`}>local_shipping</span>
                  <div>
                    <p className={`font-headline font-bold text-sm ${formData.paymentMethod === "cod" ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>{copy.codTitle}</p>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-black">{copy.codDesc}</p>
                  </div>
                </div>
              </label>
            </div>
            <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.03] p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-base text-[#6FF7E8]">
                  notifications
                </span>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  {copy.orderEmailsStart}{" "}
                  <span className="font-bold text-on-surface">
                    {settings.notifications.orderUpdates ? copy.enabled : copy.disabled}
                  </span>
                  .
                </p>
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="w-full bg-gradient-primary text-[#003732] font-headline font-black text-xl py-6 rounded-2xl shadow-[0_0_30px_rgba(111,247,232,0.3)] hover:brightness-110 hover:scale-[1.01] active:scale-[0.98] transition-all tracking-tighter uppercase flex items-center justify-center gap-3">
            {loading ? (
              <>
                 <span className="material-symbols-outlined animate-spin">refresh</span> {copy.processing}
              </>
            ) : (
              <>
                {copy.confirm}
                <span className="material-symbols-outlined">send_and_archive</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: 40% */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-2xl sticky top-28 border border-white/5 bg-[#0A1010]/80 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#EAFAF8] uppercase">{copy.manifest}</h2>
              <span className="font-label text-[10px] bg-white/5 px-2 py-1 rounded text-[#6FF7E8] font-black tracking-widest uppercase">{items.length} {copy.units}</span>
            </div>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-low shrink-0 border border-white/5">
                    <Image src={item.product.thumbnail_url} alt={item.product.name} width={64} height={64} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-xs leading-snug text-[#EAFAF8] truncate">{item.product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] text-on-surface-variant/60 font-black uppercase tracking-widest">{copy.qty} {item.quantity}</p>
                      <Price amount={item.product.price * item.quantity} className="font-headline font-bold text-[#6FF7E8] text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="font-label text-[10px] uppercase tracking-widest font-black">{copy.subtotal}</span>
                <Price amount={subtotal} className="font-headline font-bold text-sm tracking-tight text-[#EAFAF8]" />
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-black">{copy.deliveryCharge}</span>
                <div className="text-right">
                  <span className={`font-headline font-bold text-sm ${shippingDiscount > 0 || subtotal > 2000000 ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>
                    {shippingFee > 0 ? <Price amount={shippingFee} /> : copy.free}
                  </span>
                  {shippingDiscount > 0 && <Price amount={30000} className="block text-[9px] text-[#6FF7E8]/40 font-black uppercase tracking-tighter mt-1 line-through opacity-50" />}
                </div>
              </div>

              {orderDiscount > 0 && (
                <div className="flex justify-between items-center text-[#6FF7E8] bg-[#6FF7E8]/5 p-3 rounded-xl border border-[#6FF7E8]/10">
                  <span className="font-label text-[10px] uppercase tracking-widest flex items-center gap-2 font-black">
                    <span className="material-symbols-outlined text-sm">redeem</span> {copy.rewards}
                  </span>
                  <Price amount={orderDiscount} negative className="font-headline font-bold text-sm" />
                </div>
              )}

              <div className="flex justify-between items-end pt-6 mt-6 border-t border-white/5">
                <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-black">{copy.total}</span>
                <Price amount={totalPrice} className="font-headline font-black text-3xl text-gradient tracking-tighter leading-none" />
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 justify-center">
              <span className="material-symbols-outlined text-[#6FF7E8] text-sm animate-pulse">encrypted</span>
              <p className="font-label text-[9px] tracking-widest text-[#EAFAF8]/60 uppercase font-black">{copy.securePay}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
