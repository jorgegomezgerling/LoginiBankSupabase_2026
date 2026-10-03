import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PASSWORD_RULES } from "../utils/validation";
import { colors, fonts, spacing } from "../theme";

export default function PasswordChecklist({ value = "" }) {
  return (
    <View style={styles.list}>
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <View
            key={rule.id}
            style={styles.row}
            accessibilityLabel={`${rule.label}: ${ok ? "cumplido" : "pendiente"}`}
          >
            <Ionicons
              name={ok ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={ok ? colors.success : colors.textMuted}
            />
            <Text style={[styles.text, ok && { color: colors.success }]}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  text: { fontSize: 12, fontFamily: fonts.regular, color: colors.textMuted },
});
