import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync("authToken");
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync("authToken", token);
}

export async function removeAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync("authToken");
}

export async function getUserApiKeys(): Promise<Record<string, string>> {
  const keys = await AsyncStorage.getItem("userApiKeys");
  return keys ? JSON.parse(keys) : {};
}

export async function setUserApiKeys(keys: Record<string, string>): Promise<void> {
  await AsyncStorage.setItem("userApiKeys", JSON.stringify(keys));
}

export async function getPreferences(): Promise<any> {
  const prefs = await AsyncStorage.getItem("preferences");
  return prefs ? JSON.parse(prefs) : {};
}

export async function setPreferences(prefs: any): Promise<void> {
  await AsyncStorage.setItem("preferences", JSON.stringify(prefs));
}