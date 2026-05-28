"use client";

import Link from "next/link";
import { useAccountSettings } from "@/hooks/useAccountSettings";

const FOOTER_COPY = {
  en: {
    tagline:
      "Engineered for collectors who demand the highest tier of craftsmanship and rarity.",
    navigation: "Navigation",
    shopAll: "Shop All",
    preOrders: "Pre-orders",
    exclusives: "Exclusives",
    newArrivals: "New Arrivals",
    support: "Support",
    authenticity: "Authenticity",
    shipping: "Shipping",
    returns: "Returns",
    privacy: "Privacy",
    acceptedAssets: "Accepted Assets",
    copyright: "\u00a9 2026 OVERLORD TOYS. ENGINEERED FOR COLLECTORS.",
  },
  vi: {
    tagline:
      "D\u00e0nh cho nh\u00e0 s\u01b0u t\u1ea7m mu\u1ed1n s\u1ea3n ph\u1ea9m tinh x\u1ea3o, hi\u1ebfm v\u00e0 \u0111\u00e1ng gi\u00e1.",
    navigation: "\u0110i\u1ec1u h\u01b0\u1edbng",
    shopAll: "T\u1ea5t c\u1ea3 s\u1ea3n ph\u1ea9m",
    preOrders: "\u0110\u1eb7t tr\u01b0\u1edbc",
    exclusives: "\u0110\u1ed9c quy\u1ec1n",
    newArrivals: "H\u00e0ng m\u1edbi",
    support: "H\u1ed7 tr\u1ee3",
    authenticity: "T\u00ednh x\u00e1c th\u1ef1c",
    shipping: "V\u1eadn chuy\u1ec3n",
    returns: "\u0110\u1ed5i tr\u1ea3",
    privacy: "Ri\u00eang t\u01b0",
    acceptedAssets: "Thanh to\u00e1n h\u1ed7 tr\u1ee3",
    copyright: "\u00a9 2026 OVERLORD TOYS. D\u00c0NH CHO NH\u00c0 S\u01afU T\u1ea6M.",
  },
};

export default function Footer() {
  const { settings } = useAccountSettings();
  const copy = FOOTER_COPY[settings.shopping.language];

  return (
    <footer className="bg-[#06151a] grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 border-t border-white/5 w-full font-['Inter'] text-sm uppercase tracking-widest">
      <div className="space-y-6">
        <Link className="text-lg font-bold text-[#EAFAF8]" href="/">
          OVERLORD TOYS
        </Link>
        <p className="normal-case text-on-surface-variant tracking-normal max-w-xs">
          {copy.tagline}
        </p>
        <div className="flex gap-4">
          <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:text-[#6FF7E8] transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">public</span>
          </a>
          <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:text-[#6FF7E8] transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">camera</span>
          </a>
          <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:text-[#6FF7E8] transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">play_circle</span>
          </a>
        </div>
      </div>
      <div className="space-y-6">
        <h5 className="text-[#6FF7E8] font-bold">{copy.navigation}</h5>
        <ul className="space-y-4">
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/shop">
              {copy.shopAll}
            </Link>
          </li>
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/category/pre-orders">
              {copy.preOrders}
            </Link>
          </li>
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/category/exclusives">
              {copy.exclusives}
            </Link>
          </li>
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/category/new-arrivals">
              {copy.newArrivals}
            </Link>
          </li>
        </ul>
      </div>
      <div className="space-y-6">
        <h5 className="text-[#6FF7E8] font-bold">{copy.support}</h5>
        <ul className="space-y-4">
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/about">
              {copy.authenticity}
            </Link>
          </li>
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/shipping">
              {copy.shipping}
            </Link>
          </li>
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/returns">
              {copy.returns}
            </Link>
          </li>
          <li>
            <Link className="text-[#EAFAF8]/40 hover:text-[#6FF7E8] transition-colors duration-200" href="/privacy">
              {copy.privacy}
            </Link>
          </li>
        </ul>
      </div>
      <div className="space-y-6">
        <h5 className="text-[#6FF7E8] font-bold">{copy.acceptedAssets}</h5>
        <div className="flex flex-wrap gap-4">
          <div className="glass-card px-4 py-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-xl">payments</span>
            <span className="ml-2 text-[10px]">VISA</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-xl">contactless</span>
            <span className="ml-2 text-[10px]">PAYOS</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-xl">credit_card</span>
            <span className="ml-2 text-[10px]">MASTERCARD</span>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant mt-8 normal-case tracking-normal">
          {copy.copyright}
        </p>
      </div>
    </footer>
  );
}
