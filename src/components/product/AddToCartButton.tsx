"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className: string;
  iconName?: string;
  children?: ReactNode;
  preventNavigation?: boolean;
  ariaLabel?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className,
  iconName,
  children,
  preventNavigation = false,
  ariaLabel,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (preventNavigation) {
      event.preventDefault();
      event.stopPropagation();
    }

    addToCart(product, quantity);
    setAdded(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <button aria-label={ariaLabel} className={className} onClick={handleClick} type="button">
      {iconName ? <span className="material-symbols-outlined">{iconName}</span> : null}
      {children}
      {added ? <span className="sr-only">Da them vao gio hang</span> : null}
    </button>
  );
}
