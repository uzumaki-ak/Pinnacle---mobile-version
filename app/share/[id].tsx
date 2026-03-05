import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SharedItemScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [item, setItem] = useState<any>(null);

  const colors = {
    light: { background: "#F5F1E8", card: "#FFFFFF", text: "#1F2937", textSecondary: "#6B7280", primary: "#2563EB" },
    dark: { background: "#141414", card: "#1F1F1F", text: "#F5F1E8", textSecondary: "#9CA3AF", primary: "#3B82F6" },
  };

  const theme = colors[colorScheme ?? "light"];

  useEffect(() => {
    fetchSharedItem();
  }, []);

  const fetchSharedItem = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/share/${id}`);
      const data = await response.json();
      setItem(data);
    } catch (error) {
      console.error("Failed to fetch shared item:", error);
    }
  };

  if (!item) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.content, { color: theme.textSecondary }]}>{item.content_snippet}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={[styles.button, { backgroundColor: theme.primary }]}>
          <Ionicons name="open-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Open Link</Text>
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