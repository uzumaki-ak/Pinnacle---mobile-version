import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/utils/api";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function FoldersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [loading, setLoading] = useState(true);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      primary: "#2563EB",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      destructive: "#EF4444",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      primary: "#3B82F6",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      border: "#374151",
      destructive: "#DC2626",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const foldersData = await apiClient.getFolders();
      setFolders(foldersData.folders);

      // Get item counts per folder
      const counts: Record<string, number> = {};
      for (const folder of foldersData.folders) {
        try {
          const items = await apiClient.getItems({ folders: folder });
          counts[folder] = items.length;
        } catch {
          counts[folder] = 0;
        }
      }
      setItemCounts(counts);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = () => {
    if (!newFolder.trim()) return;

    if (!folders.includes(newFolder.trim())) {
      setFolders([...folders, newFolder.trim()]);
      setItemCounts({ ...itemCounts, [newFolder.trim()]: 0 });
      setNewFolder("");
    }
  };

  const handleDeleteFolder = (folderName: string) => {
    Alert.alert(
      "Delete Folder",
      `Are you sure you want to delete "${folderName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const items = await apiClient.getItems({ folders: folderName });
              for (const item of items) {
                const newFolders = item.folders.filter(
                  (f: string) => f !== folderName,
                );
                await apiClient.updateItem(item.id, { folders: newFolders });
              }
              setFolders(folders.filter((f) => f !== folderName));
              const newCounts = { ...itemCounts };
              delete newCounts[folderName];
              setItemCounts(newCounts);
            } catch (error) {
              console.error("Failed to delete folder:", error);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, justifyContent: "center" },
        ]}
      >
        <Text style={{ color: theme.text, textAlign: "center" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Folders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Create Folder */}
      <View
        style={[
          styles.createSection,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border },
          ]}
          placeholder="New folder name..."
          placeholderTextColor={theme.textSecondary}
          value={newFolder}
          onChangeText={setNewFolder}
        />
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={handleCreateFolder}
          disabled={!newFolder.trim()}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Folders List */}
      {folders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="folder-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No folders yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: folder }) => (
            <TouchableOpacity
              onPress={() => router.push(`/folderitems?name=${folder}`)}
            >
              <View
                style={[
                  styles.folderCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.folderInfo}>
                  <Ionicons name="folder" size={20} color={theme.primary} />
                  <View style={styles.folderText}>
                    <Text style={[styles.folderName, { color: theme.text }]}>
                      {folder}
                    </Text>
                    <Text
                      style={[
                        styles.folderCount,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {itemCounts[folder] || 0} items
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.textSecondary}
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteFolder(folder)}
                    style={styles.deleteButton}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={theme.destructive}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  createSection: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  folderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  folderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  folderText: {
    flex: 1,
  },
  folderName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  folderCount: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
