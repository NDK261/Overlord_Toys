"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/product";
import { Price } from "@/components/settings/Price";
import { useAccountSettings } from "@/hooks/useAccountSettings";

interface ProductPurchaseControlsProps {
  product: Product;
}

export default function ProductPurchaseControls({ product }: ProductPurchaseControlsProps) {
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0);
  const { addToCart } = useCart();
  const { settings } = useAccountSettings();
  const router = useRouter();
  const isVi = settings.shopping.language === "vi";

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert(isVi ? `Sản phẩm này chỉ còn ${product.stock} sản phẩm trong kho.` : `Only ${product.stock} units available in stock.`);
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (quantity > product.stock) {
      alert(isVi ? `Sản phẩm này chỉ còn ${product.stock} sản phẩm trong kho.` : `Only ${product.stock} units available in stock.`);
      return;
    }
    addToCart(product, quantity);
    router.push("/cart");
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center glass-card rounded-xl p-1 border-white/10">
          <button 
            disabled={isOutOfStock}
            className="w-9 h-9 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none" 
            onClick={decrease} 
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span className="w-10 text-center font-bold text-base">{isOutOfStock ? 0 : quantity}</span>
          <button 
            disabled={isOutOfStock || quantity >= product.stock}
            className="w-9 h-9 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none" 
            onClick={increase} 
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
        <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-50">
          {isVi ? "Số lượng" : "Quantity"}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          disabled={isOutOfStock}
          className="bg-gradient-primary text-on-primary font-bold py-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(31,126,161,0.5)] hover:opacity-90 active:scale-95 transition-all w-full text-sm uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none" 
          onClick={handleAddToCart} 
          type="button"
        >
          {isOutOfStock ? (isVi ? "Hết hàng" : "Out of Stock") : (isVi ? "Thêm vào giỏ" : "Add to Cart")}
        </button>
        <button 
          disabled={isOutOfStock}
          className="glass-card border-outline-variant text-on-surface font-bold py-4 rounded-2xl hover:bg-white/5 active:scale-95 transition-all w-full text-center block text-sm uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none" 
          onClick={handleBuyNow} 
          type="button"
        >
          {isVi ? "Mua ngay" : "Buy Now"}
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#6FF7E8]">
        <span className="material-symbols-outlined text-lg">rocket_launch</span>
        <span className="font-medium">
          {isVi ? "Miễn phí vận chuyển cho đơn từ " : "Free shipping for orders over "}
          <Price amount={500000} />
        </span>
      </div>
    </div>
  );
}
