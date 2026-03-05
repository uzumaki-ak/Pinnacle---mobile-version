import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useChat } from "@/hooks/useChat";

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      primary: "#2563EB",
      text: "#1F2937",
      textSecondary: "#6B7280",
      userBubble: "#2563EB",
      assistantBubble: "#E5E7EB",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      primary: "#3B82F6",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      userBubble: "#3B82F6",
      assistantBubble: "#374151",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd();
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
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
                    color: item.role === "user" ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {item.content}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your saved content..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || !input.trim()}
          style={[
            styles.sendButton,
            { backgroundColor: theme.primary, opacity: loading ? 0.5 : 1 },
          ]}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});