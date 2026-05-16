"use client";

import type { ReactNode } from "react";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import type { AccountNotificationSettings } from "@/lib/account-settings";

type PreferenceGateProps = {
  preference: keyof AccountNotificationSettings;
  children: ReactNode;
  fallback?: ReactNode;
};

export function PreferenceGate({
  preference,
  children,
  fallback = null,
}: PreferenceGateProps) {
  const { settings } = useAccountSettings();

  if (!settings.notifications[preference]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

