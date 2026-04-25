"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartLink() {
  const { totalItems, isLoaded } = useCart();

  const badgeCount = isLoaded ? totalItems : 0;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);

  return (
    <Link
      className="relative text-on-surface hover:text-primary-container transition-transform scale-95 active:opacity-80"
      href="/cart"
    >
      <span className="material-symbols-outlined">shopping_cart</span>
      {badgeCount > 0 ? (
        <span
          key={badgeLabel}
          className="absolute -top-2 -right-2 bg-primary-container text-on-primary-container text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ animation: "cart-badge-pop 420ms ease-out" }}
        >
          {badgeLabel}
        </span>
      ) : null}
    </Link>
  );
}
