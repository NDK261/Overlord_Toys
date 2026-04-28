"use client";

// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabase/client";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = "toy_store_cart";
const CART_UPDATED_EVENT = "toy_store_cart_updated";

function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  const persistCart = useCallback((nextItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  }, []);

  const emitCartUpdated = useCallback((nextItems: CartItem[]) => {
    window.dispatchEvent(
      new CustomEvent<CartItem[]>(CART_UPDATED_EVENT, { detail: nextItems })
    );
  }, []);

  // Check First Order status
  useEffect(() => {
    async function checkFirstOrder() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count, error } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        if (!error) {
          setIsFirstOrder(count === 0);
        }
      } else {
        setIsFirstOrder(false);
      }
    }
    
    if (isLoaded) {
      checkFirstOrder();
    }
  }, [isLoaded]);

  // Load cart từ localStorage khi mount
  useEffect(() => {
    try {
      setItems(parseCartItems(localStorage.getItem(CART_STORAGE_KEY)));
    } catch (error) {
      console.error("Lỗi load giỏ hàng:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    emitCartUpdated(items);
  }, [emitCartUpdated, isLoaded, items]);

  useEffect(() => {
    const handleCartUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<CartItem[]>;
      setItems(customEvent.detail ?? []);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      setItems(parseCartItems(event.newValue));
    };
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated as EventListener);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let nextItems: CartItem[];
      if (existing) {
        nextItems = prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        nextItems = [...prev, { product, quantity }];
      }
      persistCart(nextItems);
      return nextItems;
    });
  }, [persistCart]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const nextItems = prev.filter((item) => item.product.id !== productId);
        persistCart(nextItems);
        return nextItems;
      });
      return;
    }
    setItems((prev) => {
      const nextItems = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      persistCart(nextItems);
      return nextItems;
    });
  }, [persistCart]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const nextItems = prev.filter((item) => item.product.id !== productId);
      persistCart(nextItems);
      return nextItems;
    });
  }, [persistCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    persistCart([]);
  }, [persistCart]);

  const [appliedVouchers, setAppliedVouchers] = useState<{
    freeship?: string;
    discount?: string;
  }>({});

  useEffect(() => {
    const saved = localStorage.getItem("toy_store_vouchers");
    if (saved) {
      try {
        setAppliedVouchers(JSON.parse(saved));
      } catch {
        setAppliedVouchers({});
      }
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const findVoucher = (code: string | undefined) => {
    if (!code) return null;
    const { vouchers } = require("@/lib/vouchers");
    return vouchers.find((v: any) => v.code.toUpperCase() === code.toUpperCase()) || null;
  };

  const freeshipVoucher = findVoucher(appliedVouchers.freeship);
  const discountVoucher = findVoucher(appliedVouchers.discount);

  // Logic Freeship 3 trường hợp:
  // 1. Đơn hàng đầu tiên (isFirstOrder)
  // 2. Giá trị đơn hàng > 1.000.000đ
  // 3. Có nhập mã FREESHIP (hoặc voucher freeship khác thỏa minOrder)
  let shippingDiscount = 0;
  const isFreeshipEligible = isFirstOrder || subtotal >= 1000000 || !!appliedVouchers.freeship;
  
  if (isFreeshipEligible) {
    shippingDiscount = 30000; // Miễn phí hoàn toàn phí ship cơ bản
  }

  let orderDiscount = 0;
  if (discountVoucher && subtotal >= discountVoucher.minOrder) {
    if (discountVoucher.rewardType === "percentage") {
      orderDiscount = Math.floor((subtotal * discountVoucher.rewardValue) / 100);
    } else {
      orderDiscount = discountVoucher.rewardValue;
    }
  }

  const baseShippingFee = subtotal > 2000000 ? 0 : (subtotal > 0 ? 30000 : 0);
  const finalShippingFee = Math.max(0, baseShippingFee - shippingDiscount);
  const totalPrice = Math.max(0, subtotal + finalShippingFee - orderDiscount);

  const applyPromoCode = useCallback((code: string) => {
    const { vouchers } = require("@/lib/vouchers");
    const voucher = vouchers.find((v: any) => v.code.toUpperCase() === code.toUpperCase());
    if (!voucher) throw new Error("Mã giảm giá không tồn tại");

    if (subtotal < voucher.minOrder) {
      throw new Error(`Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString("vi-VN")}đ để áp dụng mã này`);
    }

    setAppliedVouchers((prev) => {
      const next = { ...prev };
      if (voucher.type === "freeship") next.freeship = voucher.code;
      else next.discount = voucher.code;
      localStorage.setItem("toy_store_vouchers", JSON.stringify(next));
      return next;
    });
  }, [subtotal]);

  const removeVoucher = useCallback((type: "freeship" | "discount") => {
    setAppliedVouchers((prev) => {
      const next = { ...prev };
      delete next[type];
      localStorage.setItem("toy_store_vouchers", JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    items, totalItems, subtotal, shippingFee: finalShippingFee, shippingDiscount, 
    orderDiscount, totalPrice, appliedVouchers, applyPromoCode, removeVoucher, 
    addToCart, updateQuantity, removeFromCart, clearCart, isLoaded, isFirstOrder
  };
}
