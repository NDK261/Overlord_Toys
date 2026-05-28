"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { useUser } from "@/hooks/useUser";
import {
  LANGUAGE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  type AccountLanguage,
  type AccountPaymentMethod,
  type AccountSettings,
} from "@/lib/account-settings";

type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

const SETTINGS_COPY: Record<
  AccountLanguage,
  {
    loadingLabel: string;
    secureLabel: string;
    title: string;
    lastSaved: string;
    notSavedYet: string;
    unsavedChanges: string;
    notificationsTitle: string;
    notificationsDesc: string;
    notifications: Record<
      keyof AccountSettings["notifications"],
      { label: string; desc: string }
    >;
    shoppingTitle: string;
    shoppingDesc: string;
    languageLabel: string;
    languageOptions: Record<AccountLanguage, { label: string; desc: string }>;
    paymentLabel: string;
    paymentMethods: Record<AccountPaymentMethod, { label: string; desc: string }>;
    accountTitle: string;
    accountDesc: string;
    signOut: string;
    signingOut: string;
    reset: string;
    save: string;
    saved: string;
    saveError: string;
    resetDone: string;
    resetError: string;
    signOutError: string;
  }
> = {
  en: {
    loadingLabel: "Loading account settings",
    secureLabel: "System Config // Secured",
    title: "Settings",
    lastSaved: "Last saved",
    notSavedYet: "Not saved yet",
    unsavedChanges: "Unsaved changes",
    notificationsTitle: "Notification Preferences",
    notificationsDesc: "These switches now control real surfaces in checkout and cart.",
    notifications: {
      orderUpdates: {
        label: "Order updates",
        desc: "Checkout will send order confirmation and status emails only when this is enabled.",
      },
      promotions: {
        label: "Promotions",
        desc: "Cart will show promotional broadcasts and suggested vouchers when this is enabled.",
      },
      productRecommendations: {
        label: "Product recommendations",
        desc: "Shop surfaces such as related items and recently viewed suggestions will stay visible.",
      },
    },
    shoppingTitle: "Shopping Preferences",
    shoppingDesc:
      "Language changes supported storefront text, and the payment choice preselects checkout.",
    languageLabel: "Language",
    languageOptions: {
      en: {
        label: "English",
        desc: "Show supported store features in English.",
      },
      vi: {
        label: "Ti\u1ebfng Vi\u1ec7t",
        desc: "Show supported store features in Vietnamese.",
      },
    },
    paymentLabel: "Default payment method",
    paymentMethods: {
      payos: {
        label: "PayOS Gateway",
        desc: "Pay online and confirm the order instantly.",
      },
      cod: {
        label: "Cash on Delivery",
        desc: "Pay when the package arrives.",
      },
    },
    accountTitle: "Account Session",
    accountDesc: "End the current browser session for this account.",
    signOut: "Sign out",
    signingOut: "Signing out...",
    reset: "Reset to default",
    save: "Save preferences",
    saved: "Preferences saved",
    saveError: "Could not save preferences",
    resetDone: "Defaults restored",
    resetError: "Could not reset preferences",
    signOutError: "Could not sign out",
  },
  vi: {
    loadingLabel: "\u0110ang t\u1ea3i c\u00e0i \u0111\u1eb7t t\u00e0i kho\u1ea3n",
    secureLabel: "C\u1ea5u h\u00ecnh h\u1ec7 th\u1ed1ng // \u0110\u00e3 b\u1ea3o v\u1ec7",
    title: "C\u00e0i \u0111\u1eb7t",
    lastSaved: "L\u01b0u l\u1ea7n cu\u1ed1i",
    notSavedYet: "Ch\u01b0a l\u01b0u",
    unsavedChanges: "C\u00f3 thay \u0111\u1ed5i ch\u01b0a l\u01b0u",
    notificationsTitle: "T\u00f9y ch\u1ecdn th\u00f4ng b\u00e1o",
    notificationsDesc:
      "C\u00e1c c\u00f4ng t\u1eafc n\u00e0y \u0111ang \u0111i\u1ec1u khi\u1ec3n th\u1eadt trong checkout v\u00e0 gi\u1ecf h\u00e0ng.",
    notifications: {
      orderUpdates: {
        label: "C\u1eadp nh\u1eadt \u0111\u01a1n h\u00e0ng",
        desc: "Khi b\u1eadt, checkout s\u1ebd g\u1eedi email x\u00e1c nh\u1eadn v\u00e0 tr\u1ea1ng th\u00e1i \u0111\u01a1n h\u00e0ng.",
      },
      promotions: {
        label: "Khuy\u1ebfn m\u00e3i",
        desc: "Khi b\u1eadt, gi\u1ecf h\u00e0ng s\u1ebd hi\u1ec3n th\u1ecb th\u00f4ng b\u00e1o khuy\u1ebfn m\u00e3i v\u00e0 g\u1ee3i \u00fd voucher.",
      },
      productRecommendations: {
        label: "G\u1ee3i \u00fd s\u1ea3n ph\u1ea9m",
        desc: "Khi b\u1eadt, shop s\u1ebd gi\u1eef c\u00e1c khu v\u1ef1c s\u1ea3n ph\u1ea9m li\u00ean quan v\u00e0 \u0111\u00e3 xem g\u1ea7n \u0111\u00e2y.",
      },
    },
    shoppingTitle: "T\u00f9y ch\u1ecdn mua h\u00e0ng",
    shoppingDesc:
      "Ng\u00f4n ng\u1eef \u0111\u1ed5i c\u00e1c d\u00f2ng ch\u1eef giao di\u1ec7n \u0111\u00e3 h\u1ed7 tr\u1ee3, v\u00e0 ph\u01b0\u01a1ng th\u1ee9c thanh to\u00e1n s\u1ebd \u0111\u01b0\u1ee3c ch\u1ecdn s\u1eb5n khi checkout.",
    languageLabel: "Ng\u00f4n ng\u1eef",
    languageOptions: {
      en: {
        label: "English",
        desc: "Hi\u1ec3n th\u1ecb c\u00e1c ch\u1ee9c n\u0103ng \u0111\u00e3 h\u1ed7 tr\u1ee3 b\u1eb1ng ti\u1ebfng Anh.",
      },
      vi: {
        label: "Ti\u1ebfng Vi\u1ec7t",
        desc: "Hi\u1ec3n th\u1ecb c\u00e1c ch\u1ee9c n\u0103ng \u0111\u00e3 h\u1ed7 tr\u1ee3 b\u1eb1ng ti\u1ebfng Vi\u1ec7t.",
      },
    },
    paymentLabel: "Ph\u01b0\u01a1ng th\u1ee9c thanh to\u00e1n m\u1eb7c \u0111\u1ecbnh",
    paymentMethods: {
      payos: {
        label: "C\u1ed5ng PayOS",
        desc: "Thanh to\u00e1n online v\u00e0 x\u00e1c nh\u1eadn \u0111\u01a1n h\u00e0ng ngay.",
      },
      cod: {
        label: "Thanh to\u00e1n khi nh\u1eadn h\u00e0ng",
        desc: "Thanh to\u00e1n khi \u0111\u01a1n h\u00e0ng \u0111\u01b0\u1ee3c giao t\u1edbi.",
      },
    },
    accountTitle: "Phi\u00ean t\u00e0i kho\u1ea3n",
    accountDesc: "K\u1ebft th\u00fac phi\u00ean \u0111\u0103ng nh\u1eadp hi\u1ec7n t\u1ea1i tr\u00ean tr\u00ecnh duy\u1ec7t n\u00e0y.",
    signOut: "\u0110\u0103ng xu\u1ea5t",
    signingOut: "\u0110ang \u0111\u0103ng xu\u1ea5t...",
    reset: "\u0110\u1eb7t l\u1ea1i m\u1eb7c \u0111\u1ecbnh",
    save: "L\u01b0u t\u00f9y ch\u1ecdn",
    saved: "\u0110\u00e3 l\u01b0u t\u00f9y ch\u1ecdn",
    saveError: "Kh\u00f4ng th\u1ec3 l\u01b0u t\u00f9y ch\u1ecdn",
    resetDone: "\u0110\u00e3 kh\u00f4i ph\u1ee5c m\u1eb7c \u0111\u1ecbnh",
    resetError: "Kh\u00f4ng th\u1ec3 \u0111\u1eb7t l\u1ea1i t\u00f9y ch\u1ecdn",
    signOutError: "Kh\u00f4ng th\u1ec3 \u0111\u0103ng xu\u1ea5t",
  },
};

const NOTIFICATION_OPTIONS: {
  key: keyof AccountSettings["notifications"];
  icon: string;
}[] = [
  {
    key: "orderUpdates",
    icon: "receipt_long",
  },
  {
    key: "promotions",
    icon: "campaign",
  },
  {
    key: "productRecommendations",
    icon: "auto_awesome",
  },
];

function isSameSettings(a: AccountSettings, b: AccountSettings) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function formatSavedTime(value: string | null, language: AccountLanguage) {
  if (!value) return SETTINGS_COPY[language].notSavedYet;

  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading: userLoading } = useUser();
  const { settings, loading: settingsLoading, saveSettings, resetSettings } =
    useAccountSettings();

  const [draft, setDraft] = useState<AccountSettings>(settings);
  const [status, setStatus] = useState<StatusState>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isLoading = userLoading || settingsLoading;
  const language = draft.shopping.language;
  const copy = SETTINGS_COPY[language];
  const hasChanges = useMemo(
    () => !isSameSettings(draft, settings),
    [draft, settings]
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?callbackUrl=/account/settings");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 2800);
    return () => clearTimeout(timer);
  }, [status]);

  const updateNotification = (
    key: keyof AccountSettings["notifications"],
    value: boolean
  ) => {
    setDraft((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }));
  };

  const updateLanguage = (language: AccountLanguage) => {
    setDraft((current) => ({
      ...current,
      shopping: {
        ...current.shopping,
        language,
      },
    }));
  };

  const updatePaymentMethod = (defaultPaymentMethod: AccountPaymentMethod) => {
    setDraft((current) => ({
      ...current,
      shopping: {
        ...current.shopping,
        defaultPaymentMethod,
      },
    }));
  };

  const handleSave = () => {
    try {
      saveSettings(draft);
      setStatus({ type: "success", message: copy.saved });
    } catch {
      setStatus({ type: "error", message: copy.saveError });
    }
  };

  const handleReset = () => {
    try {
      const nextSettings = resetSettings();
      setDraft(nextSettings);
      setStatus({
        type: "success",
        message: SETTINGS_COPY[nextSettings.shopping.language].resetDone,
      });
    } catch {
      setStatus({ type: "error", message: copy.resetError });
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch {
      setIsSigningOut(false);
      setStatus({ type: "error", message: copy.signOutError });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div
          aria-label={copy.loadingLabel}
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary-container/50 border-t-primary-container"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <span className="mb-2 block animate-pulse font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary-container">
          {copy.secureLabel}
        </span>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-5xl font-black tracking-tighter text-gradient md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-3 text-sm font-medium text-on-surface-variant">
              {copy.lastSaved}: {formatSavedTime(settings.updatedAt, language)}
            </p>
          </div>
          {hasChanges && (
            <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              {copy.unsavedChanges}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <section className="glass-card rounded-lg border border-white/5 bg-[#0A1010]/50 p-6 shadow-2xl md:p-10">
          <header className="mb-8">
            <h3 className="flex items-center gap-3 font-headline text-2xl font-bold text-on-surface">
              <span className="h-6 w-1.5 rounded bg-primary-container shadow-[0_0_10px_rgba(111,247,232,0.5)]" />
              {copy.notificationsTitle}
            </h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              {copy.notificationsDesc}
            </p>
          </header>

          <div className="grid gap-4">
            {NOTIFICATION_OPTIONS.map(({ key, icon }) => {
              const enabled = draft.notifications[key];
              const option = copy.notifications[key];

              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.03] p-4"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="material-symbols-outlined mt-0.5 text-primary-container">
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">
                        {option.label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {option.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Toggle ${option.label}`}
                    aria-pressed={enabled}
                    onClick={() => updateNotification(key, !enabled)}
                    className={`relative h-6 w-12 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 ${
                      enabled ? "bg-primary-container" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                        enabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass-card rounded-lg border border-white/5 bg-[#0A1010]/50 p-6 shadow-2xl md:p-10">
          <header className="mb-8">
            <h3 className="flex items-center gap-3 font-headline text-2xl font-bold text-on-surface">
              <span className="h-6 w-1.5 rounded bg-[#1F7EA1] shadow-[0_0_10px_rgba(31,126,161,0.5)]" />
              {copy.shoppingTitle}
            </h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              {copy.shoppingDesc}
            </p>
          </header>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
                {copy.languageLabel}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {LANGUAGE_OPTIONS.map((language) => {
                  const selected = draft.shopping.language === language.value;
                  const languageCopy = copy.languageOptions[language.value];

                  return (
                    <button
                      key={language.value}
                      type="button"
                      onClick={() => updateLanguage(language.value)}
                      className={`rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 ${
                        selected
                          ? "border-primary-container/50 bg-primary-container/10 text-primary-container"
                          : "border-white/5 bg-white/[0.03] text-on-surface hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="mb-3 block material-symbols-outlined text-2xl">
                        {language.icon}
                      </span>
                      <span className="block font-headline text-xl font-black">
                        {languageCopy.label}
                      </span>
                      <span className="mt-1 block text-xs text-on-surface-variant">
                        {languageCopy.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
                {copy.paymentLabel}
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {PAYMENT_METHOD_OPTIONS.map((method) => {
                  const selected =
                    draft.shopping.defaultPaymentMethod === method.value;
                  const methodCopy = copy.paymentMethods[method.value];

                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => updatePaymentMethod(method.value)}
                      className={`flex items-start gap-4 rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 ${
                        selected
                          ? "border-primary-container/50 bg-primary-container/10"
                          : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          selected ? "text-primary-container" : "text-white/40"
                        }`}
                      >
                        {method.icon}
                      </span>
                      <span>
                        <span
                          className={`block text-sm font-bold ${
                            selected ? "text-primary-container" : "text-on-surface"
                          }`}
                        >
                          {methodCopy.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">
                          {methodCopy.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-lg border border-white/5 bg-[#0A1010]/50 p-6 shadow-2xl md:p-10">
          <header className="mb-8">
            <h3 className="flex items-center gap-3 font-headline text-2xl font-bold text-on-surface">
              <span className="h-6 w-1.5 rounded bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              {copy.accountTitle}
            </h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              {copy.accountDesc}
            </p>
          </header>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center justify-center gap-3 rounded-lg border border-red-500/30 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-400 transition-all hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            {isSigningOut ? copy.signingOut : copy.signOut}
          </button>
        </section>

        <div className="sticky bottom-4 z-10 rounded-lg border border-white/10 bg-[#06151a]/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5">
              {status && (
                <p
                  role="status"
                  className={`text-xs font-bold uppercase tracking-widest ${
                    status.type === "success"
                      ? "text-primary-container"
                      : "text-red-400"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-on-surface transition-all hover:border-primary-container/40 hover:text-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60"
              >
                {copy.reset}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges}
                className="rounded-lg bg-gradient-primary px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#003732] shadow-[0_0_20px_rgba(111,247,232,0.2)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.save}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
