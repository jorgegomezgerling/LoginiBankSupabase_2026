import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, sizes, spacing } from "../theme";

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  error,
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={styles.row}
    >
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={22}
        color={error ? colors.error : checked ? colors.primary : colors.border}
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: sizes.minTouch,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text,
  },
});
