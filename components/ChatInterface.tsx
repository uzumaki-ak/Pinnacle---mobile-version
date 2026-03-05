import { View, Text, FlatList, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface({ messages }: { messages: Message[] }) {
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      userBubble: "#2563EB",
      assistantBubble: "#E5E7EB",
      userText: "#FFFFFF",
      assistantText: "#1F2937",
    },
    dark: {
      userBubble: "#3B82F6",
      assistantBubble: "#374151",
      userText: "#FFFFFF",
      assistantText: "#F5F1E8",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  return (
    <FlatList
      data={messages}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageBubble,
            item.role === "user" ? styles.userMessage : styles.assistantMessage,
          ]}
        >
          <View
            style={[
              styles.bubble,
              {
                backgroundColor:
                  item.role === "user" ? theme.userBubble : theme.assistantBubble,
              },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color: item.role === "user" ? theme.userText : theme.assistantText,
                },
              ]}
            >
              {item.content}
            </Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  messageBubble: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  assistantMessage: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
  },
});