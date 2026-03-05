import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useItems } from "@/hooks/useItems";
import { apiClient } from "@/utils/api";
import ItemCard from "@/components/ItemCard";

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { items, loading, fetchItems } = useItems();
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [showFolderFilter, setShowFolderFilter] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      primary: "#2563EB",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      border: "#374151",
      primary: "#3B82F6",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  const mediaTypes = ["article", "video", "image", "audio", "link"];

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const foldersData = await apiClient.getFolders();
      setFolders(foldersData.folders);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      const params: any = {};
      if (query) params.search = query;
      if (selectedTypes.length > 0)
        params.media_types = selectedTypes.join(",");
      if (selectedFolders.length > 0)
        params.folders = selectedFolders.join(",");

      // Fetch search results from API
      const results = await apiClient.getItems(params);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  // Auto-search when query changes
  useEffect(() => {
    if (query || selectedTypes.length > 0 || selectedFolders.length > 0) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 300); // Debounce search
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [query, selectedTypes, selectedFolders]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };
  const toggleFolder = (folder: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folder)
        ? prev.filter((f) => f !== folder)
        : [...prev, folder],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your vault..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            onSubmitEditing={handleSearch}
          />
          {query && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Type Filters */}
        <View style={styles.filters}>
          {mediaTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => toggleType(type)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedTypes.includes(type)
                    ? theme.primary
                    : theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: selectedTypes.includes(type)
                      ? "#FFFFFF"
                      : theme.text,
                  },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Folder Filters */}
        {folders.length > 0 && (
          <>
            <TouchableOpacity
              style={[
                styles.showMoreButton,
                {
                  backgroundColor: showFolderFilter
                    ? theme.primary + "20"
                    : "transparent",
                },
              ]}
              onPress={() => setShowFolderFilter(!showFolderFilter)}
            >
              <Ionicons
                name={showFolderFilter ? "chevron-up" : "chevron-down"}
                size={16}
                color={theme.primary}
              />
              <Text style={[styles.showMoreText, { color: theme.primary }]}>
                Folders ({selectedFolders.length})
              </Text>
            </TouchableOpacity>

            {showFolderFilter && (
              <View style={styles.folderFilter}>
                {folders.map((folder) => (
                  <TouchableOpacity
                    key={folder}
                    onPress={() => toggleFolder(folder)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: selectedFolders.includes(folder)
                          ? theme.primary
                          : theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="folder"
                      size={14}
                      color={
                        selectedFolders.includes(folder) ? "white" : theme.text
                      }
                    />
                    <Text
                      style={[
                        styles.filterText,
                        {
                          color: selectedFolders.includes(folder)
                            ? "#FFFFFF"
                            : theme.text,
                        },
                      ]}
                    >
                      {folder}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => router.push(`/item/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.results}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={48}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.text }]}>
              {query || selectedTypes.length > 0 || selectedFolders.length > 0
                ? "No results found"
                : "Start searching"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 13,
    fontWeight: "600",
  },
  folderFilter: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  results: {
    padding: 16,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});
