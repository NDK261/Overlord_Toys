"use client";

import { useAccountSettings } from "@/hooks/useAccountSettings";

const ACCOUNT_COPY = {
  en: {
    eyebrow: "Collector Access // Secured",
    title: "My Account",
    personalTitle: "Personal Information",
    personalDesc: "Manage your core vault identity and contact protocols.",
    securityTitle: "Security Protocols",
    securityDesc: "Strengthen your vault encryption with a new security key.",
  },
  vi: {
    eyebrow: "Truy c\u1eadp t\u00e0i kho\u1ea3n // \u0110\u00e3 b\u1ea3o v\u1ec7",
    title: "T\u00e0i kho\u1ea3n c\u1ee7a t\u00f4i",
    personalTitle: "Th\u00f4ng tin c\u00e1 nh\u00e2n",
    personalDesc: "Qu\u1ea3n l\u00fd t\u00ean, li\u00ean h\u1ec7 v\u00e0 \u0111\u1ecba ch\u1ec9 giao h\u00e0ng c\u1ee7a b\u1ea1n.",
    securityTitle: "B\u1ea3o m\u1eadt",
    securityDesc: "C\u1eadp nh\u1eadt m\u1eadt kh\u1ea9u \u0111\u1ec3 b\u1ea3o v\u1ec7 t\u00e0i kho\u1ea3n.",
  },
};

export function AccountPageTitle() {
  const { settings } = useAccountSettings();
  const copy = ACCOUNT_COPY[settings.shopping.language];

  return (
    <div className="mb-12">
      <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary-container mb-2 block animate-pulse font-mono">
        {copy.eyebrow}
      </span>
      <h1 className="text-5xl md:text-6xl font-black text-gradient font-headline tracking-tighter">
        {copy.title}
      </h1>
    </div>
  );
}

export function AccountSectionHeader({
  kind,
}: {
  kind: "personal" | "security";
}) {
  const { settings } = useAccountSettings();
  const copy = ACCOUNT_COPY[settings.shopping.language];
  const title = kind === "personal" ? copy.personalTitle : copy.securityTitle;
  const desc = kind === "personal" ? copy.personalDesc : copy.securityDesc;
  const color =
    kind === "personal"
      ? "bg-primary-container shadow-[0_0_10px_rgba(111,247,232,0.5)]"
      : "bg-[#1F7EA1] shadow-[0_0_10px_rgba(31,126,161,0.5)]";

  return (
    <header className="mb-10">
      <h3 className="text-2xl font-bold text-on-surface font-headline flex items-center gap-3">
        <span className={`w-1.5 h-6 rounded-full ${color}`} />
        {title}
      </h3>
      <p className="text-on-surface-variant text-sm mt-2 font-medium">{desc}</p>
    </header>
  );
}
