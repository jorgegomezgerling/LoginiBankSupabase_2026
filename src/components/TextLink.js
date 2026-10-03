import { Pressable, StyleSheet, Text } from "react-native";
import { colors, sizes, typography } from "../theme";

// prefix: texto neutro antes del link ("¿No tenés cuenta?" + "Registrate")
// variant="muted": link gris, como "Forgot your password ?" del kit
export default function TextLink({
  label,
  prefix,
  onPress,
  disabled,
  variant = "primary",
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="link"
      accessibilityLabel={prefix ? `${prefix} ${label}` : label}
      style={[styles.link, style]}
    >
      <Text style={[styles.prefix, disabled && styles.disabled]}>
        {prefix ? `${prefix}  ` : ""}
        <Text style={variant === "muted" ? styles.muted : styles.primary}>
          {label}
        </Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: sizes.minTouch,
    justifyContent: "center",
    alignSelf: "center",
  },
  prefix: { ...typography.caption3, color: colors.text },
  primary: { ...typography.caption1, color: colors.primary },
  muted: { ...typography.caption2, color: colors.textMuted },
  disabled: { opacity: 0.5 },
});
