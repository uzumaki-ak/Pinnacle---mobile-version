import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { apiClient } from "@/utils/api";

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [item, setItem] = useState<any>(null);

  const colors = {
    light: { background: "#F5F1E8", card: "#FFFFFF", text: "#1F2937", textSecondary: "#6B7280", primary: "#2563EB" },
    dark: { background: "#141414", card: "#1F1F1F", text: "#F5F1E8", textSecondary: "#9CA3AF", primary: "#3B82F6" },
  };
  const theme = colors[colorScheme ?? "light"];

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const data = await apiClient.getItems({ id });
      setItem(data[0]);
    } catch (error) {
      console.error("Failed to fetch item:", error);
    }
  };

  if (!item) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        {item.content_snippet && <Text style={[styles.content, { color: theme.textSecondary }]}>{item.content_snippet}</Text>}
        <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={[styles.button, { backgroundColor: theme.primary }]}>
          <Ionicons name="open-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Open URL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { margin: 16, padding: 20, borderRadius: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 12 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});