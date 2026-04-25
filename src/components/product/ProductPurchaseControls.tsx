"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/product";

interface ProductPurchaseControlsProps {
  product: Product;
}

export default function ProductPurchaseControls({ product }: ProductPurchaseControlsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center glass-card rounded-xl p-1 border-white/10">
          <button className="w-9 h-9 flex items-center justify-center hover:text-primary transition-colors" onClick={decrease} type="button">
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span className="w-10 text-center font-bold text-base">{quantity}</span>
          <button className="w-9 h-9 flex items-center justify-center hover:text-primary transition-colors" onClick={increase} type="button">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
        <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-50">Quantity</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-gradient-primary text-on-primary font-bold py-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(31,126,161,0.5)] hover:opacity-90 active:scale-95 transition-all w-full text-sm uppercase tracking-wider" onClick={handleAddToCart} type="button">
          Add to Cart
        </button>
        <button className="glass-card border-outline-variant text-on-surface font-bold py-4 rounded-2xl hover:bg-white/5 active:scale-95 transition-all w-full text-center block text-sm uppercase tracking-wider" onClick={handleBuyNow} type="button">
          Buy Now
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#6FF7E8]">
        <span className="material-symbols-outlined text-lg">rocket_launch</span>
        <span className="font-medium">Free shipping for orders over 500.000đ</span>
      </div>
    </div>
  );
}
