import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch as RNSwitch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [autoExtract, setAutoExtract] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const colors = {
    light: {
      background: "#F5F1E8",
      card: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      destructive: "#EF4444",
    },
    dark: {
      background: "#141414",
      card: "#1F1F1F",
      text: "#F5F1E8",
      textSecondary: "#9CA3AF",
      border: "#374151",
      destructive: "#DC2626",
    },
  };

  const theme = colors[colorScheme ?? "light"];

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("authToken");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const settingsSections = [
    {
      title: "Organization",
      items: [
        {
          icon: "folder-outline",
          label: "Manage Folders",
          onPress: () => router.push("/folders"),
        },
        {
          icon: "pricetag-outline",
          label: "Manage Tags",
          onPress: () => router.push("/tags"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "download-outline",
          label: "Auto Extract Content",
          value: autoExtract,
          onToggle: setAutoExtract,
        },
        {
          icon: "notifications-outline",
          label: "Notifications",
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: "key-outline",
          label: "API Keys",
          onPress: () => {},
        },
        {
          icon: "cloud-upload-outline",
          label: "Export Data",
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {settingsSections.map((section, sectionIdx) => (
        <View key={sectionIdx} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {section.title}
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {section.items.map((item, itemIdx) => (
              <View key={itemIdx}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={item.onPress}
                  disabled={item.onToggle !== undefined}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={theme.text}
                    />
                    <Text style={[styles.settingLabel, { color: theme.text }]}>
                      {item.label}
                    </Text>
                  </View>
                  {item.onToggle ? (
                    <RNSwitch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: theme.border, true: "#3B82F6" }}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.textSecondary}
                    />
                  )}
                </TouchableOpacity>
                {itemIdx < section.items.length - 1 && (
                  <View
                    style={[styles.divider, { backgroundColor: theme.border }]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: theme.card, borderColor: theme.destructive },
          ]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.destructive}
          />
          <Text style={[styles.logoutText, { color: theme.destructive }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Content Vault v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 48,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    padding: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
  },
});
