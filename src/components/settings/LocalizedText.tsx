"use client";

import { useAccountSettings } from "@/hooks/useAccountSettings";

type LocalizedTextProps = {
  en: string;
  vi: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  className?: string;
};

export function LocalizedText({
  en,
  vi,
  as: Component = "span",
  className,
}: LocalizedTextProps) {
  const { settings } = useAccountSettings();

  return (
    <Component className={className}>
      {settings.shopping.language === "vi" ? vi : en}
    </Component>
  );
}
