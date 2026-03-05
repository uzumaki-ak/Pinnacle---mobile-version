import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000";

export const API_ENDPOINTS = {
  ITEMS: "/api/v1/items",
  CHAT: "/api/v1/chat/message",
  AUTH: {
    LOGIN: "/api/v1/auth/signin",
    SIGNUP: "/api/v1/auth/signup",
    LOGOUT: "/api/v1/auth/signout",
    ME: "/api/v1/auth/me",
  },
  STATS: "/api/v1/items/stats/overview",
  EXTRACT: "/api/v1/extract/content",
  SHARE: "/api/v1/share",
};