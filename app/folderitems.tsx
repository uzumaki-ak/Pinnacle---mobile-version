import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/utils/api";
import { useColorScheme } from "@/hooks/useColorScheme";

interface Item {
  id: string;
  title: string;
  url: string;
  type: string;
  created_at: string;
  folders: string[];
  tags: string[];
}

export default function FolderItemsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const folderName = params.name as string;
  const colorScheme = useColorScheme();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      primary: "#2563EB",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      primary: "#3B82F6",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      border: "#374151",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  useEffect(() => {
    if (folderName) {
      fetchFolderItems();
    }
  }, [folderName]);

  const fetchFolderItems = async () => {
    try {
      const itemsData = await apiClient.getItems({ folders: folderName });
      setItems(itemsData);
    } catch (error) {
      console.error("Failed to fetch folder items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url).catch(() => console.error("Failed to open URL"));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="folder" size={24} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {folderName}
          </Text>
        </View>
        <Text style={[styles.itemCount, { color: theme.textSecondary }]}>
          {items.length}
        </Text>
      </View>

      {/* Items List */}
      {loading ? (
        <View style={styles.centerContent}>
          <Ionicons name="hourglass" size={48} color={theme.textSecondary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading...
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons
            name="document-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No items in this folder
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.itemContent}>
                <Text
                  style={[styles.itemTitle, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {item.title || "Untitled"}
                </Text>
                <Text
                  style={[styles.itemUrl, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.url}
                </Text>
                <View style={styles.tagsContainer}>
                  <View
                    style={[styles.badge, { backgroundColor: theme.primary }]}
                  >
                    <Text style={styles.badgeText}>{item.type || "Link"}</Text>
                  </View>
                  {item.folders &&
                    item.folders.map((folder) => (
                      <View key={folder} style={styles.folderBadge}>
                        <Text
                          style={[styles.badgeText, { color: theme.primary }]}
                        >
                          📁 {folder}
                        </Text>
                      </View>
                    ))}
                  {item.tags &&
                    item.tags.map((tag) => (
                      <View key={tag} style={styles.tagBadge}>
                        <Text style={styles.badgeText}>🏷️ {tag}</Text>
                      </View>
                    ))}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleOpenUrl(item.url)}
                style={[styles.openButton, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="open-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 12,
    gap: 12,
  },
  itemCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemUrl: {
    fontSize: 12,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  folderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A855F7",
  },
  openButton: {
    padding: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
