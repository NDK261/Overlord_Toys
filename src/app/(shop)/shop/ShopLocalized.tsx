"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ProductSearchForm } from "@/components/product";
import { useAccountSettings } from "@/hooks/useAccountSettings";

const SHOP_COPY = {
  en: {
    home: "Home",
    shop: "Shop",
    searchResults: "Search Results",
    allProducts: "All Products",
    showingSearch: (count: number, search: string) =>
      `Showing ${count} artifacts for "${search}"`,
    showingAll: (count: number) =>
      `Showing ${count} meticulously engineered artifacts`,
    searchPlaceholder: "Search product name...",
    latestArrivals: "Latest Arrivals",
    noMatching: "No Matching Artifacts",
    noProducts: "No Artifacts Found",
    tryAnother: "Try another product name",
    adjustFilters: "Adjust your scan protocols",
    inStock: "In Stock",
    collectorsChoice: "Collector's Choice",
    sold: "Sold",
  },
  vi: {
    home: "Trang ch\u1ee7",
    shop: "C\u1eeda h\u00e0ng",
    searchResults: "K\u1ebft qu\u1ea3 t\u00ecm ki\u1ebfm",
    allProducts: "T\u1ea5t c\u1ea3 s\u1ea3n ph\u1ea9m",
    showingSearch: (count: number, search: string) =>
      `Hi\u1ec3n th\u1ecb ${count} s\u1ea3n ph\u1ea9m cho "${search}"`,
    showingAll: (count: number) =>
      `Hi\u1ec3n th\u1ecb ${count} s\u1ea3n ph\u1ea9m \u0111ang c\u00f3`,
    searchPlaceholder: "T\u00ecm t\u00ean s\u1ea3n ph\u1ea9m...",
    latestArrivals: "M\u1edbi nh\u1ea5t",
    noMatching: "Kh\u00f4ng c\u00f3 s\u1ea3n ph\u1ea9m ph\u00f9 h\u1ee3p",
    noProducts: "Ch\u01b0a c\u00f3 s\u1ea3n ph\u1ea9m",
    tryAnother: "H\u00e3y th\u1eed t\u00ean s\u1ea3n ph\u1ea9m kh\u00e1c",
    adjustFilters: "\u0110i\u1ec1u ch\u1ec9nh b\u1ed9 l\u1ecdc c\u1ee7a b\u1ea1n",
    inStock: "C\u00f2n h\u00e0ng",
    collectorsChoice: "Nh\u00e0 s\u01b0u t\u1ea7m ch\u1ecdn",
    sold: "\u0110\u00e3 b\u00e1n",
  },
};

export function ShopTitleSection({
  hasSearch,
  productCount,
  search,
}: {
  hasSearch: boolean;
  productCount: number;
  search?: string;
}) {
  const { settings } = useAccountSettings();
  const copy = SHOP_COPY[settings.shopping.language];

  return (
    <section className="mb-12">
      <nav className="mb-4 text-xs font-label uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
        <Link className="hover:text-primary-fixed" href="/">
          {copy.home}
        </Link>
        <span className="material-symbols-outlined text-[10px]">
          chevron_right
        </span>
        <span className="text-primary-fixed">{copy.shop}</span>
      </nav>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter text-gradient">
            {hasSearch ? copy.searchResults : copy.allProducts}
          </h1>
          <p className="text-on-surface-variant mt-2 font-body">
            {hasSearch && search
              ? copy.showingSearch(productCount, search)
              : copy.showingAll(productCount)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <Suspense
            fallback={<div className="h-12 w-full rounded-xl bg-white/5 md:w-80" />}
          >
            <ProductSearchForm
              className="relative w-full md:w-80"
              inputClassName="w-full rounded-xl border border-[#6FF7E8]/20 bg-[#0a1f26]/50 py-3 pl-10 pr-10 text-sm text-[#EAFAF8] placeholder:text-[#EAFAF8]/30 outline-none transition-all focus:border-[#6FF7E8] focus:ring-1 focus:ring-[#6FF7E8]"
              placeholderEn={SHOP_COPY.en.searchPlaceholder}
              placeholderVi={SHOP_COPY.vi.searchPlaceholder}
            />
          </Suspense>
          <button className="glass-card px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-label uppercase tracking-widest hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-primary-container">
              sort
            </span>
            {copy.latestArrivals}
          </button>
        </div>
      </div>
    </section>
  );
}

export function ShopEmptyState({ hasSearch }: { hasSearch: boolean }) {
  const { settings } = useAccountSettings();
  const copy = SHOP_COPY[settings.shopping.language];

  return (
    <div className="h-64 flex flex-col items-center justify-center border-2 border-white/5 border-dashed rounded-3xl opacity-50">
      <span className="material-symbols-outlined text-4xl mb-2">
        inventory_2
      </span>
      <p className="font-headline font-bold text-lg">
        {hasSearch ? copy.noMatching : copy.noProducts}
      </p>
      <p className="text-xs text-on-surface-variant uppercase tracking-widest">
        {hasSearch ? copy.tryAnother : copy.adjustFilters}
      </p>
    </div>
  );
}

export function ShopBadge({ kind }: { kind: "inStock" | "collectorsChoice" }) {
  const { settings } = useAccountSettings();
  const copy = SHOP_COPY[settings.shopping.language];

  return (
    <span className="bg-primary-container text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
      {copy[kind]}
    </span>
  );
}

export function SoldCount({ count }: { count: number }) {
  const { settings } = useAccountSettings();
  const copy = SHOP_COPY[settings.shopping.language];

  return (
    <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">
      {count} {copy.sold}
    </span>
  );
}
