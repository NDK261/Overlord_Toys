export type AccountCurrency = "VND" | "USD";
export type AccountPaymentMethod = "payos" | "cod";

export type AccountNotificationSettings = {
  orderUpdates: boolean;
  promotions: boolean;
  productRecommendations: boolean;
};

export type AccountShoppingSettings = {
  currency: AccountCurrency;
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
    currency: "VND",
    defaultPaymentMethod: "payos",
  },
  updatedAt: null,
};

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
      currency:
        shopping.currency === "VND" || shopping.currency === "USD"
          ? shopping.currency
          : DEFAULT_ACCOUNT_SETTINGS.shopping.currency,
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

export function formatAccountPrice(amount: number, currency: AccountCurrency) {
  if (currency === "USD") {
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

