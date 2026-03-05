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

export default function TagsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
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
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const tagsData = await apiClient.getTags();
      setTags(tagsData.tags);

      // Get item counts per tag
      const counts: Record<string, number> = {};
      for (const tag of tagsData.tags) {
        try {
          const items = await apiClient.getItems({ tags: tag });
          counts[tag] = items.length;
        } catch {
          counts[tag] = 0;
        }
      }
      setItemCounts(counts);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = () => {
    if (!newTag.trim()) return;

    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setItemCounts({ ...itemCounts, [newTag.trim()]: 0 });
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagName: string) => {
    Alert.alert("Delete Tag", `Are you sure you want to delete "${tagName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const items = await apiClient.getItems({ tags: tagName });
            for (const item of items) {
              const newTags = item.tags.filter((t: string) => t !== tagName);
              await apiClient.updateItem(item.id, { tags: newTags });
            }
            setTags(tags.filter((t) => t !== tagName));
            const newCounts = { ...itemCounts };
            delete newCounts[tagName];
            setItemCounts(newCounts);
          } catch (error) {
            console.error("Failed to delete tag:", error);
          }
        },
      },
    ]);
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tags</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Create Tag */}
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
          placeholder="New tag name..."
          placeholderTextColor={theme.textSecondary}
          value={newTag}
          onChangeText={setNewTag}
        />
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={handleCreateTag}
          disabled={!newTag.trim()}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tags List */}
      {tags.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="pricetag-outline"
            size={48}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No tags yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={tags}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: tag }) => (
            <View
              style={[
                styles.tagCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.tagInfo}>
                <Ionicons name="pricetag" size={20} color={theme.primary} />
                <View style={styles.tagText}>
                  <Text style={[styles.tagName, { color: theme.text }]}>
                    #{tag}
                  </Text>
                  <Text
                    style={[styles.tagCount, { color: theme.textSecondary }]}
                  >
                    {itemCounts[tag] || 0} items
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteTag(tag)}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={theme.destructive}
                />
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
  tagCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  tagText: {
    flex: 1,
  },
  tagName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  tagCount: {
    fontSize: 12,
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
