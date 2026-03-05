import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getUserApiKeys, setUserApiKeys } from "@/utils/storage";

const PROVIDERS = [
  { key: "groq", label: "Groq" },
  { key: "google", label: "Google AI" },
  { key: "euron", label: "Euron" },
  { key: "openrouter", label: "OpenRouter" },
  { key: "mistral", label: "Mistral" },
  { key: "openai", label: "OpenAI" },
];

export default function ApiKeyModal({ visible, onClose }: any) {
  const colorScheme = useColorScheme();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#6B7280",
      primary: "#2563EB",
      border: "#E5E7EB",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      primary: "#3B82F6",
      border: "#374151",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    const savedKeys = await getUserApiKeys();
    setKeys(savedKeys);
  };

  const handleSave = async () => {
    await setUserApiKeys(keys);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>API Keys</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {PROVIDERS.map((provider) => (
              <View key={provider.key} style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {provider.label}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={keys[provider.key] || ""}
                    onChangeText={(text) =>
                      setKeys({ ...keys, [provider.key]: text })
                    }
                    placeholder={`Enter ${provider.label} API key`}
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showKey[provider.key]}
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowKey({ ...showKey, [provider.key]: !showKey[provider.key] })
                    }
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showKey[provider.key] ? "eye-off" : "eye"}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.saveButtonText}>Save Keys</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  saveButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});