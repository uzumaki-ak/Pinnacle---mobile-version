import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { apiClient } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import ItemCard from "@/components/ItemCard";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{
    mediaType?: string;
    folder?: string;
  }>({});

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
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      fetchItems();
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedFilter.mediaType && selectedFilter.mediaType !== "all") {
        params.media_types = selectedFilter.mediaType;
      }
      if (selectedFilter.folder) {
        params.folders = selectedFilter.folder;
      }
      const data = await apiClient.getItems(params);
      setItems(data);
      const statsData = await apiClient.getStats();
      setStats(statsData);

      // Fetch available folders
      const foldersData = await apiClient.getFolders();
      setFolders(foldersData.folders);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.card, theme.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subGreeting, { color: theme.textSecondary }]}>
              Your content vault
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/save")}
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {stats?.total_items || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Items
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {stats?.total_folders || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Folders
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {stats?.total_tags || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Tags
            </Text>
          </View>
        </View>
      </LinearGradient>

      {loading && items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons
            name="hourglass-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Loading...
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons
            name="folder-open-outline"
            size={64}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No items yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Login and save content from browser
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => router.push(`/item/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 12 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: "500" },
  statDivider: { width: 1, height: 40, backgroundColor: "#E5E7EB" },
  listContent: { padding: 16, paddingBottom: 32 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: { fontSize: 14, textAlign: "center" },
});
