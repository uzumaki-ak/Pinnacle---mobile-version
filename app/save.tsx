import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/utils/api";
import { useColorScheme } from "@/hooks/useColorScheme";

type MediaType = "article" | "video" | "youtube" | "audio" | "other";

export default function SaveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const [url, setUrl] = useState(params.url ? String(params.url) : "");
  const [title, setTitle] = useState(params.title ? String(params.title) : "");
  const [mediaType, setMediaType] = useState<MediaType>("article");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [folderInput, setFolderInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [showFolderSuggestions, setShowFolderSuggestions] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      primary: "#2563EB",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      primary: "#3B82F6",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      border: "#374151",
      success: "#059669",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  const mediaTypeOptions: { label: string; value: MediaType }[] = [
    { label: "Article", value: "article" },
    { label: "Video", value: "video" },
    { label: "YouTube", value: "youtube" },
    { label: "Audio", value: "audio" },
    { label: "Other", value: "other" },
  ];

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [foldersData, tagsData] = await Promise.all([
        apiClient.getFolders(),
        apiClient.getTags(),
      ]);
      setFolders(foldersData.folders);
      setTags(tagsData.tags);
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    }
  };

  const handleSave = async () => {
    if (!url.trim() || !title.trim()) {
      Alert.alert("Missing Information", "Please enter URL and title");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createItem({
        url: url.trim(),
        title: title.trim(),
        media_type: mediaType,
        folders: selectedFolders,
        tags: selectedTags,
        note: note.trim() || null,
      });

      Alert.alert("Success", "Content saved!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Failed to save content:", error);
      Alert.alert("Error", "Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFolder = (folder: string) => {
    setSelectedFolders(selectedFolders.filter((f) => f !== folder));
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const folderSuggestions = folders.filter(
    (f) =>
      !selectedFolders.includes(f) &&
      f.toLowerCase().includes(folderInput.toLowerCase()),
  );

  const tagSuggestions = tags.filter(
    (t) =>
      !selectedTags.includes(t) &&
      t.toLowerCase().includes(tagInput.toLowerCase()),
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Save Content
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* URL */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>URL</Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border },
          ]}
          placeholder="https://..."
          placeholderTextColor={theme.textSecondary}
          value={url}
          onChangeText={setUrl}
          editable={!loading}
        />
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Title</Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border },
          ]}
          placeholder="Content title..."
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />
      </View>

      {/* Media Type */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Media Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeButtons}
        >
          {mediaTypeOptions.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                {
                  backgroundColor:
                    mediaType === type.value ? theme.primary : theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setMediaType(type.value)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  {
                    color: mediaType === type.value ? "white" : theme.text,
                  },
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Folders */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Folders</Text>
        <View
          style={[
            styles.input,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <TextInput
            style={[styles.autocompleteInput, { color: theme.text }]}
            placeholder="Add folder..."
            placeholderTextColor={theme.textSecondary}
            value={folderInput}
            onChangeText={setFolderInput}
            onFocus={() => setShowFolderSuggestions(true)}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => {
              if (
                folderInput.trim() &&
                !selectedFolders.includes(folderInput.trim())
              ) {
                setSelectedFolders([...selectedFolders, folderInput.trim()]);
                if (!folders.includes(folderInput.trim())) {
                  setFolders([...folders, folderInput.trim()]);
                }
                setFolderInput("");
                setShowFolderSuggestions(false);
              }
            }}
            disabled={!folderInput.trim() || loading}
          >
            <Ionicons name="add" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {showFolderSuggestions &&
          folderInput &&
          folderSuggestions.length > 0 && (
            <View
              style={[
                styles.suggestions,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {folderSuggestions.map((folder) => (
                <TouchableOpacity
                  key={folder}
                  onPress={() => {
                    setSelectedFolders([...selectedFolders, folder]);
                    setFolderInput("");
                    setShowFolderSuggestions(false);
                  }}
                  style={styles.suggestionItem}
                >
                  <Ionicons name="folder" size={16} color={theme.primary} />
                  <Text style={[styles.suggestionText, { color: theme.text }]}>
                    {folder}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        {/* Selected Folders */}
        {selectedFolders.length > 0 && (
          <View style={styles.selectedItems}>
            {selectedFolders.map((folder) => (
              <View
                key={folder}
                style={[
                  styles.badge,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Ionicons name="folder" size={14} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {folder}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveFolder(folder)}>
                  <Ionicons
                    name="close-circle"
                    size={14}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Tags</Text>
        <View
          style={[
            styles.input,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <TextInput
            style={[styles.autocompleteInput, { color: theme.text }]}
            placeholder="Add tag..."
            placeholderTextColor={theme.textSecondary}
            value={tagInput}
            onChangeText={setTagInput}
            onFocus={() => setShowTagSuggestions(true)}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => {
              if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
                setSelectedTags([...selectedTags, tagInput.trim()]);
                if (!tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                }
                setTagInput("");
                setShowTagSuggestions(false);
              }
            }}
            disabled={!tagInput.trim() || loading}
          >
            <Ionicons name="add" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {showTagSuggestions && tagInput && tagSuggestions.length > 0 && (
          <View
            style={[
              styles.suggestions,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {tagSuggestions.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => {
                  setSelectedTags([...selectedTags, tag]);
                  setTagInput("");
                  setShowTagSuggestions(false);
                }}
                style={styles.suggestionItem}
              >
                <Ionicons name="pricetag" size={16} color={theme.primary} />
                <Text style={[styles.suggestionText, { color: theme.text }]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <View style={styles.selectedItems}>
            {selectedTags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.badge,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Ionicons name="pricetag" size={14} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  #{tag}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Ionicons
                    name="close-circle"
                    size={14}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>
          Note (Optional)
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.noteInput,
            { color: theme.text, borderColor: theme.border },
          ]}
          placeholder="Add a personal note..."
          placeholderTextColor={theme.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
          editable={!loading}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Content</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  autocompleteInput: {
    flex: 1,
    fontSize: 14,
  },
  noteInput: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  typeButtons: {
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  suggestions: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 150,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
  },
  selectedItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  saveButton: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
