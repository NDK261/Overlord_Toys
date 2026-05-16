"use client";

import { formatAccountPrice } from "@/lib/account-settings";
import { useAccountSettings } from "@/hooks/useAccountSettings";

type PriceProps = {
  amount: number;
  className?: string;
  negative?: boolean;
};

export function Price({ amount, className, negative = false }: PriceProps) {
  const { settings } = useAccountSettings();
  const formatted = formatAccountPrice(amount, settings.shopping.currency);

  return (
    <span className={className}>
      {negative ? "-" : ""}
      {formatted}
    </span>
  );
}

