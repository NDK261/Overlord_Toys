"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { useUser } from "@/hooks/useUser";
import {
  PAYMENT_METHOD_OPTIONS,
  type AccountCurrency,
  type AccountPaymentMethod,
  type AccountSettings,
} from "@/lib/account-settings";

type StatusState = {
  type: "success" | "error";
  message: string;
} | null;

const NOTIFICATION_OPTIONS: {
  key: keyof AccountSettings["notifications"];
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    key: "orderUpdates",
    label: "Order updates",
    desc: "Checkout will send order confirmation and status emails only when this is enabled.",
    icon: "receipt_long",
  },
  {
    key: "promotions",
    label: "Promotions",
    desc: "Cart will show promotional broadcasts and suggested vouchers when this is enabled.",
    icon: "campaign",
  },
  {
    key: "productRecommendations",
    label: "Product recommendations",
    desc: "Shop surfaces such as related items and recently viewed suggestions will stay visible.",
    icon: "auto_awesome",
  },
];

function isSameSettings(a: AccountSettings, b: AccountSettings) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function formatSavedTime(value: string | null) {
  if (!value) return "Not saved yet";

  return new Intl.DateTimeFormat("vi-VN", {
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

  const updateCurrency = (currency: AccountCurrency) => {
    setDraft((current) => ({
      ...current,
      shopping: {
        ...current.shopping,
        currency,
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
      setStatus({ type: "success", message: "Preferences saved" });
    } catch {
      setStatus({ type: "error", message: "Could not save preferences" });
    }
  };

  const handleReset = () => {
    try {
      const nextSettings = resetSettings();
      setDraft(nextSettings);
      setStatus({ type: "success", message: "Defaults restored" });
    } catch {
      setStatus({ type: "error", message: "Could not reset preferences" });
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
      setStatus({ type: "error", message: "Could not sign out" });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div
          aria-label="Loading account settings"
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary-container/50 border-t-primary-container"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <span className="mb-2 block animate-pulse font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary-container">
          System Config // Secured
        </span>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-5xl font-black tracking-tighter text-gradient md:text-6xl">
              Settings
            </h1>
            <p className="mt-3 text-sm font-medium text-on-surface-variant">
              Last saved: {formatSavedTime(settings.updatedAt)}
            </p>
          </div>
          {hasChanges && (
            <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <section className="glass-card rounded-lg border border-white/5 bg-[#0A1010]/50 p-6 shadow-2xl md:p-10">
          <header className="mb-8">
            <h3 className="flex items-center gap-3 font-headline text-2xl font-bold text-on-surface">
              <span className="h-6 w-1.5 rounded bg-primary-container shadow-[0_0_10px_rgba(111,247,232,0.5)]" />
              Notification Preferences
            </h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              These switches now control real surfaces in checkout and cart.
            </p>
          </header>

          <div className="grid gap-4">
            {NOTIFICATION_OPTIONS.map(({ key, label, desc, icon }) => {
              const enabled = draft.notifications[key];

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
                        {label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Toggle ${label}`}
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
              Shopping Preferences
            </h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              Currency changes product prices, and the payment choice preselects checkout.
            </p>
          </header>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
                Currency
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(["VND", "USD"] as AccountCurrency[]).map((currency) => {
                  const selected = draft.shopping.currency === currency;

                  return (
                    <button
                      key={currency}
                      type="button"
                      onClick={() => updateCurrency(currency)}
                      className={`rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 ${
                        selected
                          ? "border-primary-container/50 bg-primary-container/10 text-primary-container"
                          : "border-white/5 bg-white/[0.03] text-on-surface hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="block font-headline text-xl font-black">
                        {currency}
                      </span>
                      <span className="mt-1 block text-xs text-on-surface-variant">
                        {currency === "VND"
                          ? "Display prices in Vietnamese Dong."
                          : "Display prices in estimated US Dollar."}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">
                Default payment method
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {PAYMENT_METHOD_OPTIONS.map((method) => {
                  const selected =
                    draft.shopping.defaultPaymentMethod === method.value;

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
                          {method.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">
                          {method.description}
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
              Account Session
            </h3>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">
              End the current browser session for this account.
            </p>
          </header>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center justify-center gap-3 rounded-lg border border-red-500/30 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-400 transition-all hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            {isSigningOut ? "Signing out..." : "Sign out"}
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
                Reset to default
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges}
                className="rounded-lg bg-gradient-primary px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#003732] shadow-[0_0_20px_rgba(111,247,232,0.2)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
