export const API_BASE_URL = "https://dummyjson.com";

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  USERS: "/users",
  USER_PROFILE: "/auth/me",
} as const;

export const APP_CONSTANTS = {
  PAGINATION_LIMIT: 30,
  STORAGE_KEYS: {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    FAVORITES: "favorites",
    USER_DATA: "user_data",
  },
} as const;

export const ROUTES = {
  MAIN_TABS: "MainTabs",
  ADDRESS_BOOK: "AddressBook",
  FAVORITES: "Favorites",
  PROFILE: "Profile",
  CONTACT_DETAIL: "ContactDetail",
} as const;

export const COLORS = {
  PRIMARY: "#007AFF",
  SECONDARY: "#5856D6",
  SUCCESS: "#34C759",
  WARNING: "#FF9500",
  ERROR: "#FF3B30",
  BACKGROUND: "#F8F9FA",
  CARD_BACKGROUND: "#FFFFFF",
  TEXT_PRIMARY: "#1C1C1E",
  TEXT_SECONDARY: "#8E8E93",
  BORDER: "#E5E5EA",
  SHADOW: "rgba(0, 0, 0, 0.1)",
} as const;

export const TYPOGRAPHY = {
  FONT_SIZES: {
    LARGE: 24,
    MEDIUM: 18,
    REGULAR: 16,
    SMALL: 14,
    TINY: 12,
  },
  FONT_WEIGHTS: {
    BOLD: "bold",
    SEMIBOLD: "600",
    MEDIUM: "500",
    REGULAR: "normal",
  },
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
} as const;
