import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { formatDistanceToNow } from "date-fns";

export default function ItemCard({ item, onPress }: any) {
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      card: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      badge: "#EDE9DD",
      badgeText: "#2563EB",
    },
    dark: {
      card: "#1F1F1F",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      border: "#374151",
      badge: "#374151",
      badgeText: "#3B82F6",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  const getMediaTypeIcon = (type: string) => {
    const icons: any = {
      article: "document-text",
      video: "videocam",
      youtube: "logo-youtube",
      image: "image",
      audio: "musical-notes",
      link: "link",
    };
    return icons[type] || "link";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      activeOpacity={0.7}
    >
      {item.thumbnail_url && (
        <Image
          source={{ uri: item.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name={getMediaTypeIcon(item.media_type)}
            size={16}
            color={theme.badgeText}
          />
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        {item.content_snippet && (
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {item.content_snippet}
          </Text>
        )}

        {item.folders && item.folders.length > 0 && (
          <View style={styles.badges}>
            <View style={styles.badgeRow}>
              <Ionicons name="folder" size={14} color={theme.badgeText} />
              {item.folders.slice(0, 2).map((folder: string) => (
                <View
                  key={folder}
                  style={[styles.badge, { backgroundColor: theme.badge }]}
                >
                  <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                    {folder}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {item.tags && item.tags.length > 0 && (
          <View style={styles.badges}>
            <View style={styles.badgeRow}>
              <Ionicons name="pricetag" size={14} color={theme.badgeText} />
              {item.tags.slice(0, 2).map((tag: string) => (
                <View
                  key={tag}
                  style={[styles.badge, { backgroundColor: theme.badge }]}
                >
                  <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  badges: {
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
  },
});
