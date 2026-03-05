import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.103:8000";

async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("authToken");
  } catch {
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  console.log("FETCHING:", `${API_URL}${url}`);
  
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    console.log("RESPONSE STATUS:", response.status);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || response.statusText);
    }

    return response.json();
  } catch (error) {
    console.log("FETCH ERROR:", error);
    throw error;
  }
}

export const apiClient = {
  async getItems(params?: any) {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchWithAuth(`/api/v1/items${queryString}`);
  },

  async getFolders() {
    return fetchWithAuth("/api/v1/items/metadata/folders");
  },

  async getTags() {
    return fetchWithAuth("/api/v1/items/metadata/tags");
  },

  async createItem(data: any) {
    return fetchWithAuth("/api/v1/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateItem(id: string, data: any) {
    return fetchWithAuth(`/api/v1/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async getStats() {
    return fetchWithAuth("/api/v1/items/stats/overview");
  },

  async chatMessage(messages: any[]) {
    return fetchWithAuth("/api/v1/chat/message", {
      method: "POST",
      body: JSON.stringify({
        messages,
        use_rag: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/v1/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  async signup(email: string, password: string, fullName: string) {
    const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    if (!response.ok) throw new Error("Signup failed");
    return response.json();
  },
};
