import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function FormMessage({ type = "error", text }) {
  if (!text) return null;
  const color = type === "error" ? colors.error : colors.success;
  return (
    <View
      style={[styles.box, { borderColor: color }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Text style={{ color }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 10, padding: spacing.md },
});
