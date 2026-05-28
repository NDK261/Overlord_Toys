export type AccountLanguage = "en" | "vi";
export type AccountPaymentMethod = "payos" | "cod";

export type AccountNotificationSettings = {
  orderUpdates: boolean;
  promotions: boolean;
  productRecommendations: boolean;
};

export type AccountShoppingSettings = {
  language: AccountLanguage;
  defaultPaymentMethod: AccountPaymentMethod;
};

export type AccountSettings = {
  notifications: AccountNotificationSettings;
  shopping: AccountShoppingSettings;
  updatedAt: string | null;
};

export const ACCOUNT_SETTINGS_UPDATED_EVENT = "overlord_account_settings_updated";
export const VND_TO_USD_RATE = 25000;

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  notifications: {
    orderUpdates: true,
    promotions: true,
    productRecommendations: true,
  },
  shopping: {
    language: "en",
    defaultPaymentMethod: "payos",
  },
  updatedAt: null,
};

export const LANGUAGE_OPTIONS: {
  value: AccountLanguage;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "en",
    label: "English",
    description: "Use English for supported storefront search and shopping text.",
    icon: "language",
  },
  {
    value: "vi",
    label: "Ti\u1ebfng Vi\u1ec7t",
    description:
      "D\u00f9ng ti\u1ebfng Vi\u1ec7t cho c\u00e1c ph\u1ea7n c\u1eeda h\u00e0ng \u0111\u00e3 h\u1ed7 tr\u1ee3 song ng\u1eef.",
    icon: "translate",
  },
];

export const PAYMENT_METHOD_OPTIONS: {
  value: AccountPaymentMethod;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "payos",
    label: "PayOS Gateway",
    description: "Pay online and confirm the order instantly.",
    icon: "payments",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay when the package arrives.",
    icon: "local_shipping",
  },
];

export function getAccountSettingsStorageKey(userId?: string | null) {
  return `account_settings:${userId || "guest"}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getLanguageFromLegacyCurrency(value: unknown): AccountLanguage | null {
  if (value === "USD") return "en";
  if (value === "VND") return "vi";
  return null;
}

export function parseAccountSettings(raw: string | null): AccountSettings | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return sanitizeAccountSettings(parsed);
  } catch {
    return null;
  }
}

export function sanitizeAccountSettings(value: unknown): AccountSettings {
  if (!isRecord(value)) return DEFAULT_ACCOUNT_SETTINGS;

  const notifications = isRecord(value.notifications) ? value.notifications : {};
  const shopping = isRecord(value.shopping) ? value.shopping : {};
  const language =
    shopping.language === "en" || shopping.language === "vi"
      ? shopping.language
      : getLanguageFromLegacyCurrency(shopping.currency) ??
        DEFAULT_ACCOUNT_SETTINGS.shopping.language;

  return {
    notifications: {
      orderUpdates:
        typeof notifications.orderUpdates === "boolean"
          ? notifications.orderUpdates
          : DEFAULT_ACCOUNT_SETTINGS.notifications.orderUpdates,
      promotions:
        typeof notifications.promotions === "boolean"
          ? notifications.promotions
          : DEFAULT_ACCOUNT_SETTINGS.notifications.promotions,
      productRecommendations:
        typeof notifications.productRecommendations === "boolean"
          ? notifications.productRecommendations
          : DEFAULT_ACCOUNT_SETTINGS.notifications.productRecommendations,
    },
    shopping: {
      language,
      defaultPaymentMethod:
        shopping.defaultPaymentMethod === "payos" ||
        shopping.defaultPaymentMethod === "cod"
          ? shopping.defaultPaymentMethod
          : DEFAULT_ACCOUNT_SETTINGS.shopping.defaultPaymentMethod,
    },
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : DEFAULT_ACCOUNT_SETTINGS.updatedAt,
  };
}

export function formatAccountPrice(amount: number, language: AccountLanguage) {
  if (language === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / VND_TO_USD_RATE);
  }

  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount)} VND`;
}
