import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SecureStore from "expo-secure-store";
import { apiClient } from "@/utils/api";

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSignup = async () => {
    if (!fullName || !email || !password) return;
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.signup(email, password, fullName);
      await SecureStore.setItemAsync("authToken", response.access_token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.primary }]}>Content Vault</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Create your account
          </Text>

          <View style={styles.form}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
              ]}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
              ]}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              style={[
                styles.input,
                { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
              ]}
            />
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              At least 6 characters
            </Text>

            {error && (
              <Text style={[styles.error, { color: "#EF4444" }]}>{error}</Text>
            )}

            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              style={[
                styles.button,
                { backgroundColor: theme.primary, opacity: loading ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              style={styles.linkButton}
            >
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Already have an account?{" "}
                <Text style={{ color: theme.primary, fontWeight: "600" }}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  hint: {
    fontSize: 12,
    marginTop: -12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    fontSize: 14,
    textAlign: "center",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
  },
});