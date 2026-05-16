"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { Price } from "@/components/settings/Price";

export default function CheckoutPage() {
  const { 
    items, subtotal, shippingFee, shippingDiscount, orderDiscount, 
    totalPrice, appliedVouchers, clearCart, isLoaded: cartLoaded 
  } = useCart();
  const { user, profile, loading: userLoading } = useUser();
  const { settings, loading: settingsLoading } = useAccountSettings();
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
          throw new Error(result.error || "Có lỗi xảy ra khi tạo đơn hàng");
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
        throw new Error("Lỗi hệ thống (500). Vui lòng kiểm tra cấu hình thanh toán hoặc thử lại sau.");
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <p className="font-headline text-on-surface-variant text-xs tracking-widest uppercase animate-pulse">Initializing Secure Protocol...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl border-white/10 p-8 text-center max-w-md w-full">
          <p className="font-headline text-2xl font-bold mb-3 text-[#EAFAF8]">No Artifacts Detected</p>
          <p className="text-on-surface-variant mb-6 text-sm">Your acquisition queue is currently empty.</p>
          <Link href="/cart" className="inline-block bg-gradient-primary text-[#003732] font-headline font-bold px-8 py-3 rounded-xl uppercase tracking-widest">
            Scan Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Editorial Header */}
      <div className="mb-12">
        <span className="font-label text-xs tracking-widest text-[#6FF7E8] uppercase opacity-80 font-black">Security Level: Class A</span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter mt-2 text-[#EAFAF8] uppercase lg:text-6xl">Finalize Acquisition</h1>
      </div>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* Left Column: 60% */}
        <div className="lg:col-span-6 space-y-8">
          {/* Shipping Info */}
          <section className="glass-card p-8 bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#6FF7E8]">local_shipping</span>
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#EAFAF8]">DEPLOYMENT COORDS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">Identity Tag</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm text-[#EAFAF8]" placeholder="Full Name" type="text"/>
              </div>
              <div className="space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">Comms Freq</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm text-[#EAFAF8]" placeholder="Phone Number" type="tel"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">Encrypted Mail</label>
                <input required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm text-[#EAFAF8]" placeholder="Email Address" type="email"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="font-label text-[10px] tracking-widest text-[#6FF7E8]/60 uppercase ml-1 font-black">Drop Zone</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-surface-container-highest/30 border-b border-white/10 focus:border-[#6FF7E8] transition-all py-3 px-4 rounded-t-lg outline-none text-sm resize-none text-[#EAFAF8]" placeholder="Physical Delivery Address" rows={3}></textarea>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="glass-card p-8 bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#6FF7E8]">account_balance_wallet</span>
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#EAFAF8]">CREDIT PROTOCOL</h2>
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
                    <p className={`font-headline font-bold text-sm ${formData.paymentMethod === "payos" ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>PayOS Gateway</p>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-black">Instant clearance</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-tighter ${formData.paymentMethod === "payos" ? "bg-[#6FF7E8] text-[#003732] shadow-[0_0_10px_#6FF7E8]" : "bg-white/10 text-white/40"}`}>SECURE</span>
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
                    <p className={`font-headline font-bold text-sm ${formData.paymentMethod === "cod" ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>Delivery Settlement (COD)</p>
                    <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-black">Pay at drop zone</p>
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
                  Order update emails are{" "}
                  <span className="font-bold text-on-surface">
                    {settings.notifications.orderUpdates ? "enabled" : "disabled"}
                  </span>
                  .
                </p>
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="w-full bg-gradient-primary text-[#003732] font-headline font-black text-xl py-6 rounded-2xl shadow-[0_0_30px_rgba(111,247,232,0.3)] hover:brightness-110 hover:scale-[1.01] active:scale-[0.98] transition-all tracking-tighter uppercase flex items-center justify-center gap-3">
            {loading ? (
              <>
                 <span className="material-symbols-outlined animate-spin">refresh</span> Processing...
              </>
            ) : (
              <>
                Confirm Transmission
                <span className="material-symbols-outlined">send_and_archive</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: 40% */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-2xl sticky top-28 border border-white/5 bg-[#0A1010]/80 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h2 className="font-headline text-xl font-bold tracking-tight text-[#EAFAF8]">MANIFEST</h2>
              <span className="font-label text-[10px] bg-white/5 px-2 py-1 rounded text-[#6FF7E8] font-black tracking-widest uppercase">{items.length} Units</span>
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
                      <p className="text-[10px] text-on-surface-variant/60 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                      <Price amount={item.product.price * item.quantity} className="font-headline font-bold text-[#6FF7E8] text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="font-label text-[10px] uppercase tracking-widest font-black">Subtotal</span>
                <Price amount={subtotal} className="font-headline font-bold text-sm tracking-tight text-[#EAFAF8]" />
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-black">Delivery Charge</span>
                <div className="text-right">
                  <span className={`font-headline font-bold text-sm ${shippingDiscount > 0 || subtotal > 2000000 ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>
                    {shippingFee > 0 ? <Price amount={shippingFee} /> : "FREE"}
                  </span>
                  {shippingDiscount > 0 && <Price amount={30000} className="block text-[9px] text-[#6FF7E8]/40 font-black uppercase tracking-tighter mt-1 line-through opacity-50" />}
                </div>
              </div>

              {orderDiscount > 0 && (
                <div className="flex justify-between items-center text-[#6FF7E8] bg-[#6FF7E8]/5 p-3 rounded-xl border border-[#6FF7E8]/10">
                  <span className="font-label text-[10px] uppercase tracking-widest flex items-center gap-2 font-black">
                    <span className="material-symbols-outlined text-sm">redeem</span> Rewards Applied
                  </span>
                  <Price amount={orderDiscount} negative className="font-headline font-bold text-sm" />
                </div>
              )}

              <div className="flex justify-between items-end pt-6 mt-6 border-t border-white/5">
                <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-black">Total Valuation</span>
                <Price amount={totalPrice} className="font-headline font-black text-3xl text-gradient tracking-tighter leading-none" />
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 justify-center">
              <span className="material-symbols-outlined text-[#6FF7E8] text-sm animate-pulse">encrypted</span>
              <p className="font-label text-[9px] tracking-widest text-[#EAFAF8]/60 uppercase font-black">Secure Neural-Pay Protocol Active</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
