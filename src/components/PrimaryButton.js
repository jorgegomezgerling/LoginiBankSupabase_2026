import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radius, sizes, spacing, typography } from "../theme";

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  loadingText = "Cargando...",
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.btn,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <View style={styles.row}>
          <ActivityIndicator color={colors.onPrimary} />
          <Text style={styles.text}>{loadingText}</Text>
        </View>
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: Math.max(sizes.buttonHeight, sizes.minTouch),
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  disabled: { backgroundColor: colors.primaryDisabled },
  pressed: { opacity: 0.85 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  text: { color: colors.onPrimary, ...typography.body1 },
});
