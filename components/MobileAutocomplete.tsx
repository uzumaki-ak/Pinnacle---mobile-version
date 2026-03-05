import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

interface MobileAutocompleteProps {
  suggestions: string[];
  selected: string[];
  onSelect: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder: string;
  label: string;
  theme: any;
}

export default function MobileAutocomplete({
  suggestions,
  selected,
  onSelect,
  onRemove,
  placeholder,
  label,
  theme,
}: MobileAutocompleteProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    const available = suggestions.filter(
      (s) =>
        !selected.includes(s) && s.toLowerCase().includes(input.toLowerCase()),
    );
    setFiltered(available);
  }, [input, suggestions, selected]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setInput("");
    setIsOpen(false);
  };

  const canCreateNew =
    input.trim() &&
    !suggestions.includes(input.trim()) &&
    !selected.includes(input.trim());

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.input,
          {
            borderColor: theme.border,
            backgroundColor: theme.card,
          },
        ]}
      >
        <TextInput
          style={[styles.textInput, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          onFocus={() => setIsOpen(true)}
        />
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.primary}
        />
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            styles.dropdown,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
            },
          ]}
        >
          <ScrollView scrollEnabled={filtered.length > 5} nestedScrollEnabled>
            {filtered.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelect(item)}
                style={[styles.option, { borderColor: theme.border }]}
              >
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

            {canCreateNew && (
              <TouchableOpacity
                onPress={() => handleSelect(input.trim())}
                style={[
                  styles.option,
                  { borderColor: theme.border, borderTopWidth: 1 },
                ]}
              >
                <Text style={[styles.createText, { color: theme.primary }]}>
                  + Create "{input.trim()}"
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {selected.length > 0 && (
        <View style={styles.selectedContainer}>
          {selected.map((item) => (
            <View
              key={item}
              style={[styles.selectedItem, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.selectedText}>{item}</Text>
              <TouchableOpacity onPress={() => onRemove(item)}>
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    marginTop: -1,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
  createText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
