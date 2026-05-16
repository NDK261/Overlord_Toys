"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/hooks/useUser";
import {
  ACCOUNT_SETTINGS_UPDATED_EVENT,
  DEFAULT_ACCOUNT_SETTINGS,
  type AccountSettings,
  getAccountSettingsStorageKey,
  parseAccountSettings,
  sanitizeAccountSettings,
} from "@/lib/account-settings";

function parseLegacyRecord(raw: string | null): Record<string, unknown> {
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function readLegacySettings(userId?: string | null): AccountSettings | null {
  if (typeof window === "undefined") return null;

  const suffix = userId || "guest";
  const legacyNotif =
    window.localStorage.getItem(`settings_notif:${suffix}`) ??
    window.localStorage.getItem("settings_notif");
  const legacyDisplay =
    window.localStorage.getItem(`settings_display:${suffix}`) ??
    window.localStorage.getItem("settings_display");

  if (!legacyNotif && !legacyDisplay) return null;

  const notif = parseLegacyRecord(legacyNotif);
  const display = parseLegacyRecord(legacyDisplay);

  return sanitizeAccountSettings({
    notifications: {
      orderUpdates: notif.orderUpdates,
      promotions: notif.promotions,
      productRecommendations: notif.newArrivals,
    },
    shopping: {
      currency: display.currency,
      defaultPaymentMethod: DEFAULT_ACCOUNT_SETTINGS.shopping.defaultPaymentMethod,
    },
    updatedAt: null,
  });
}

export function useAccountSettings() {
  const { user, loading: userLoading } = useUser();
  const [settings, setSettings] = useState<AccountSettings>(
    DEFAULT_ACCOUNT_SETTINGS
  );
  const [loading, setLoading] = useState(true);

  const storageKey = useMemo(
    () => getAccountSettingsStorageKey(user?.id),
    [user?.id]
  );

  const loadSettings = useCallback(() => {
    if (typeof window === "undefined") return DEFAULT_ACCOUNT_SETTINGS;

    const saved = parseAccountSettings(window.localStorage.getItem(storageKey));
    const nextSettings = saved ?? readLegacySettings(user?.id) ?? DEFAULT_ACCOUNT_SETTINGS;

    setSettings(nextSettings);
    setLoading(false);
    return nextSettings;
  }, [storageKey, user?.id]);

  useEffect(() => {
    if (userLoading) return;
    loadSettings();
  }, [loadSettings, userLoading]);

  useEffect(() => {
    const handleSettingsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<AccountSettings>;
      if (customEvent.detail) {
        setSettings(sanitizeAccountSettings(customEvent.detail));
      } else {
        loadSettings();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setSettings(parseAccountSettings(event.newValue) ?? DEFAULT_ACCOUNT_SETTINGS);
      }
    };

    window.addEventListener(
      ACCOUNT_SETTINGS_UPDATED_EVENT,
      handleSettingsUpdated as EventListener
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        ACCOUNT_SETTINGS_UPDATED_EVENT,
        handleSettingsUpdated as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadSettings, storageKey]);

  const saveSettings = useCallback(
    (nextSettings: AccountSettings) => {
      const sanitized = sanitizeAccountSettings({
        ...nextSettings,
        updatedAt: new Date().toISOString(),
      });

      window.localStorage.setItem(storageKey, JSON.stringify(sanitized));
      setSettings(sanitized);
      window.dispatchEvent(
        new CustomEvent<AccountSettings>(ACCOUNT_SETTINGS_UPDATED_EVENT, {
          detail: sanitized,
        })
      );

      return sanitized;
    },
    [storageKey]
  );

  const resetSettings = useCallback(() => {
    return saveSettings(DEFAULT_ACCOUNT_SETTINGS);
  }, [saveSettings]);

  return {
    settings,
    loading: loading || userLoading,
    saveSettings,
    resetSettings,
    reloadSettings: loadSettings,
  };
}

