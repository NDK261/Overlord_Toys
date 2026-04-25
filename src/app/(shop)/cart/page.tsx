"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { products } from "@/lib/mock-data";
import { vouchers } from "@/lib/vouchers";

export default function CartPage() {
  const { 
    items, removeFromCart, updateQuantity, clearCart, 
    subtotal, shippingFee, shippingDiscount, orderDiscount, 
    totalPrice, appliedVouchers, applyPromoCode, removeVoucher,
    isFirstOrder
  } = useCart();
  
  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const handleApplyCoupon = (code?: string) => {
    try {
      applyPromoCode(code || couponInput);
      setCouponInput("");
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const appliedCount = (appliedVouchers.freeship ? 1 : 0) + (appliedVouchers.discount ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen text-on-surface">
      {/* Editorial Header */}
      <div className="mb-12">
        <nav className="flex text-xs uppercase tracking-widest text-on-surface-variant mb-4 gap-2 font-medium">
          <Link className="hover:text-primary transition-colors" href="/">Home</Link>
          <span>&gt;</span>
          <span className="text-primary-fixed-dim">Cart</span>
        </nav>
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-gradient uppercase">Vault Contents</h1>
        
        {/* PROMO BANNER */}
        {items.length > 0 && (
          <div className="mt-8 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6FF7E8]/20 to-transparent animate-pulse group-hover:from-[#6FF7E8]/30 transition-all"></div>
            <div className="relative border border-[#6FF7E8]/30 bg-[#0A1010] p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(111,247,232,0.05)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#6FF7E8] text-[#003732] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(111,247,232,0.4)]">
                  <span className="material-symbols-outlined text-3xl font-bold">campaign</span>
                </div>
                <div>
                  <h4 className="font-headline font-black text-sm uppercase tracking-wider text-[#EAFAF8]">System Broadcast: New Acquisition Detected</h4>
                  <p className="text-[10px] md:text-xs text-on-surface-variant/80 font-medium uppercase tracking-[0.1em] mt-1 leading-relaxed">
                    Apply code <span className="text-[#6FF7E8] font-black border-b border-[#6FF7E8]/40">FREESHIP</span> for <span className="text-white">Zero-Cost delivery</span> 
                    {isFirstOrder ? " on your very first deployment (any value)." : " for deployments over 1,000,000đ."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  try {
                    applyPromoCode("FREESHIP");
                    setError("");
                  } catch (err: any) {
                    setError(err.message);
                  }
                }}
                className="whitespace-nowrap px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#EAFAF8] hover:bg-[#6FF7E8] hover:text-[#003732] hover:border-[#6FF7E8] transition-all active:scale-95"
              >
                Claim Reward
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:w-[65%] flex flex-col gap-8">
          <div className="glass-card overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">shopping_cart</span>
                  <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Your cart is empty</h3>
                  <p className="text-on-surface-variant mb-6">Looks like you haven't added any artifacts to your cart yet.</p>
                  <Link href="/shop" className="bg-gradient-primary text-[#003732] px-8 py-3 rounded-xl font-headline font-bold tracking-widest uppercase hover:brightness-110 transition-all inline-block">
                    Explore Vault
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex flex-col md:flex-row items-center gap-6 group border-b border-white/5 pb-8 last:border-0 last:pb-0">
                    <Link href={`/product/${item.product.slug}`} className="w-32 h-32 rounded-xl overflow-hidden bg-surface-container-low flex-shrink-0 border border-outline-variant/10 group-hover:border-primary-container/30 transition-colors block shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                      <Image src={item.product.thumbnail_url} alt={item.product.name} width={128} height={128} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="flex-grow">
                      <span className="text-[10px] font-label font-bold tracking-[0.2em] text-[#6FF7E8] uppercase font-mono">Artifact #{String(item.product.id).substring(0,4)}</span>
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="text-xl font-headline font-bold text-on-surface mt-1 group-hover:text-[#6FF7E8] transition-colors">{item.product.name}</h3>
                      </Link>
                      <p className="text-sm text-on-surface-variant/80 mt-1 line-clamp-1">{item.product.description}</p>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center bg-surface-container-highest/50 rounded-full border border-outline-variant/20 px-3 py-1">
                        <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">remove</button>
                        <span className="mx-4 font-label font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">add</button>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <p className="text-lg font-headline font-bold text-primary-fixed">{(item.product.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                        {item.quantity > 1 && <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">{item.product.price.toLocaleString("vi-VN")}đ ea.</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="material-symbols-outlined text-on-surface-variant/50 hover:text-error transition-colors p-2 cursor-pointer">delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button onClick={clearCart} className="group flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors font-label font-bold text-sm uppercase tracking-widest cursor-pointer">
                <span className="material-symbols-outlined text-lg">delete_sweep</span>
                Purge Vault
              </button>
              <Link href="/shop" className="px-8 py-3 rounded-xl border border-outline-variant/50 hover:border-[#6FF7E8] text-on-surface hover:text-[#6FF7E8] transition-all font-label font-bold text-sm uppercase tracking-widest active:scale-95 inline-block text-center glass-card">
                Return to Shop
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Summary & Vouchers */}
        <div className="lg:w-[35%] w-full flex flex-col gap-6 sticky top-28">
          
          {/* VOUCHER PICKER SECTION */}
          {items.length > 0 && (
            <div className={`glass-card border overflow-hidden transition-all duration-300 ${isVoucherOpen ? "border-[#6FF7E8]/30 shadow-[0_0_20px_rgba(111,247,232,0.1)]" : "border-white/5"}`}>
              {/* Toggle Header */}
              <button 
                onClick={() => setIsVoucherOpen(!isVoucherOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${appliedCount > 0 ? "bg-[#6FF7E8] text-[#003732]" : "bg-white/5 text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-xl">confirmation_number</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-headline font-bold uppercase tracking-widest text-[10px] text-[#EAFAF8]">Rewards & Coupons</h3>
                    {appliedCount > 0 ? (
                      <p className="text-[9px] text-[#6FF7E8] font-black uppercase tracking-tight">{appliedCount} Applied</p>
                    ) : (
                      <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tight">Select or enter codes</p>
                    )}
                  </div>
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isVoucherOpen ? "rotate-180" : ""}`}>
                  keyboard_arrow_down
                </span>
              </button>

              {/* Collapsible Content */}
              <div className={`transition-all duration-500 ease-in-out ${isVoucherOpen ? "max-h-[800px] opacity-100 border-t border-white/5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                <div className="p-6 space-y-6">
                  {/* Manual Input */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest ml-1">Manual Cipher</p>
                    <div className="relative group overflow-hidden rounded-xl border border-white/10 hover:border-[#6FF7E8]/50 transition-all">
                      <input 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-surface-container-highest/30 px-4 py-3 text-xs outline-none pr-20" 
                        placeholder="Enter Promo Code..." 
                      />
                      <button 
                        onClick={() => handleApplyCoupon()}
                        className="absolute right-0 top-0 bottom-0 bg-[#6FF7E8] text-[#003732] text-[10px] font-black uppercase tracking-widest px-4 hover:brightness-110 active:scale-95 transition-all"
                      >
                        Submit
                      </button>
                    </div>
                    {error && <p className="text-[9px] text-error font-bold tracking-tight uppercase px-1">{error}</p>}
                  </div>

                  {/* Voucher List */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest ml-1">Available Artifacts</p>
                    <div className="flex flex-col gap-3">
                      {vouchers.map(v => {
                        const isApplied = appliedVouchers.freeship === v.code || appliedVouchers.discount === v.code;
                        const canApply = subtotal >= v.minOrder;
                        
                        return (
                          <div 
                            key={v.id} 
                            className={`flex items-center p-3 rounded-xl border transition-all ${
                              isApplied 
                                ? "border-[#6FF7E8] bg-[#6FF7E8]/10 shadow-[inner_0_0_15px_rgba(111,247,232,0.1)]" 
                                : "border-white/5 bg-white/5 hover:border-white/10"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-3 ${isApplied ? "bg-[#6FF7E8] text-[#003732]" : "bg-white/5 text-[#6FF7E8]/60"}`}>
                              <span className="material-symbols-outlined text-xl">
                                {v.type === "freeship" ? "local_shipping" : "percent"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 mr-2">
                              <h4 className="font-headline font-bold text-xs uppercase text-[#EAFAF8] truncate leading-tight">{v.name}</h4>
                              <p className="text-[9px] text-on-surface-variant/80 font-bold uppercase tracking-tight mt-0.5">
                                {v.description?.split(',')[0]}
                              </p>
                              {!canApply && !isApplied && (
                                <p className="text-[8px] text-error/80 font-bold uppercase tracking-tighter mt-1">
                                  Min: {v.minOrder.toLocaleString("vi-VN")}đ
                                </p>
                              )}
                            </div>
                            <button 
                              onClick={() => isApplied ? removeVoucher(v.type) : handleApplyCoupon(v.code)}
                              disabled={!canApply && !isApplied}
                              className={`px-4 py-1.5 rounded-lg font-label text-[10px] font-black uppercase tracking-tighter transition-all shrink-0 ${
                                isApplied 
                                  ? "bg-[#6FF7E8] text-[#003732] shadow-[0_0_15px_rgba(111,247,232,0.3)]" 
                                  : "bg-white/5 text-on-surface hover:bg-[#6FF7E8] hover:text-[#003732] disabled:opacity-20 disabled:cursor-not-allowed"
                              }`}
                            >
                              {isApplied ? "Remove" : "Apply"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDER RECEIPT SECTION */}
          <div className="glass-card border border-white/5 shadow-2xl">
            <div className="p-8">
              <h2 className="text-xl font-headline font-bold text-on-surface mb-8 tracking-tight uppercase border-b border-white/5 pb-4">Order Receipt</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="font-label text-xs uppercase tracking-widest">Subtotal</span>
                  <span className="font-headline font-bold text-sm text-[#EAFAF8]">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest">Vault Delivery</span>
                  <div className="text-right">
                    <span className={`font-headline font-bold text-sm ${shippingDiscount > 0 || subtotal > 2000000 ? "text-[#6FF7E8]" : "text-[#EAFAF8]"}`}>
                      {shippingFee > 0 ? `${shippingFee.toLocaleString("vi-VN")}đ` : "FREE"}
                    </span>
                    {shippingDiscount > 0 && (
                      <p className="text-[9px] text-[#6FF7E8]/60 font-bold uppercase tracking-tighter mt-1 line-through opacity-50">30.000đ</p>
                    )}
                  </div>
                </div>

                {orderDiscount > 0 && (
                  <div className="flex justify-between items-center text-[#6FF7E8] bg-[#6FF7E8]/5 p-3 rounded-xl border border-[#6FF7E8]/20">
                    <span className="font-label text-[10px] uppercase tracking-widest flex items-center gap-2 font-black">
                      <span className="material-symbols-outlined text-sm">redeem</span> Floor Discount
                    </span>
                    <span className="font-headline font-bold text-sm">-{orderDiscount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-white/5 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest mb-1">Final Clearance</span>
                  <span className="text-4xl font-headline font-black text-gradient tracking-tighter leading-none">{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                {(shippingDiscount > 0 || orderDiscount > 0) && (
                  <div className="mt-4 py-2 bg-[#6FF7E8]/5 rounded-lg text-center border border-[#6FF7E8]/10">
                    <p className="text-[10px] font-label font-bold text-[#6FF7E8] uppercase tracking-[0.2em] animate-pulse">
                      Total Assets Saved: {(shippingDiscount + orderDiscount).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                )}
              </div>

              {items.length > 0 ? (
                <Link href="/checkout" className="w-full py-5 rounded-2xl bg-gradient-primary text-[#003732] font-headline font-black text-lg uppercase tracking-widest hover:brightness-110 hover:shadow-[0_0_30px_rgba(111,247,232,0.3)] active:scale-[0.98] transition-all mb-6 flex items-center justify-center gap-3">
                  Initiate Checkout
                  <span className="material-symbols-outlined">bolt</span>
                </Link>
              ) : (
                <button disabled className="w-full py-5 rounded-2xl bg-surface-container-highest text-on-surface-variant font-headline font-bold text-lg uppercase tracking-widest mb-6 flex items-center justify-center gap-3 cursor-not-allowed opacity-50">
                  Checkout Offline
                </button>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] text-on-surface-variant/60 bg-white/5 p-3 rounded-xl border border-white/5 uppercase tracking-widest justify-center">
                  <span className="material-symbols-outlined text-sm text-[#6FF7E8]">policy</span>
                  <p>Encrypted Delivery Protocols Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENTLY VIEWED Section */}
      <section className="mt-24 pt-12 border-t border-white/5">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tighter uppercase">Recently Viewed</h2>
          <Link href="/shop" className="text-[#6FF7E8] hover:text-[#EAFAF8] font-label font-bold text-[10px] uppercase tracking-[0.2em] transition-all">View All Artifacts</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(p => (
            <Link href={`/product/${p.slug}`} key={p.id} className="glass-card p-4 group cursor-pointer hover:shadow-[0_0_20px_rgba(111,247,232,0.15)] transition-all block group">
              <div className="h-56 rounded-xl overflow-hidden bg-surface-container-low mb-4 relative">
                <Image src={p.thumbnail_url} alt={p.name} width={400} height={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[9px] font-label font-bold text-[#6FF7E8] uppercase tracking-[0.3em] font-mono">Artifact #{String(p.id).substring(0,4)}</span>
              <h3 className="font-headline font-bold text-on-surface group-hover:text-[#6FF7E8] transition-colors mt-1 line-clamp-1 text-sm">{p.name}</h3>
              <p className="text-sm font-headline font-bold text-[#6FF7E8] mt-2">{p.price.toLocaleString("vi-VN")}đ</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
